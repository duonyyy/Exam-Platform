<?php

namespace Tests\Feature\Exams;

use App\Enums\QuestionStatus;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Tests\TestCase;

class ExamQuestionConcurrencyTest extends TestCase
{
    use DatabaseTruncation;

    public function test_disabling_question_wins_race_against_concurrent_attach(): void
    {
        $admin = User::factory()->admin()->create();
        $subject = new Subject(['code' => 'RACE', 'name' => 'Race']);
        $subject->created_by = $admin->id;
        $subject->save();
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Concurrency']);
        $question = new Question([
            'topic_id' => $topic->id,
            'question_text' => '2 + 2 = ?',
            'question_type' => 'single_choice',
            'options' => [['id' => 'a', 'content' => '4'], ['id' => 'b', 'content' => '5']],
            'correct_answer' => 'a',
            'difficulty' => 'easy',
        ]);
        $question->created_by = $admin->id;
        $question->status = QuestionStatus::READY;
        $question->source = 'manual';
        $question->save();
        $exam = new Exam([
            'title' => 'Race exam', 'duration_minutes' => 60, 'pass_score' => 0,
            'shuffle_questions' => false, 'shuffle_options' => false,
        ]);
        $exam->subject_id = $subject->id;
        $exam->created_by = $admin->id;
        $exam->total_points = 0;
        $exam->save();
        $token = $admin->createToken('race-test')->plainTextToken;

        $process = new Process(
            ['php', base_path('tests/Support/AttachExamWorker.php'), (string) $exam->id, (string) $question->id],
            null,
            ['ATTACH_TEST_TOKEN' => $token, 'DB_DATABASE' => config('database.connections.pgsql.database')]
        );
        $process->setTimeout(120);
        $blocked = false;
        $output = '';

        DB::beginTransaction();
        try {
            // ASVS V15.4: hold the row lock while the other HTTP process attempts assembly.
            $lockedQuestion = Question::query()->whereKey($question->id)->lockForUpdate()->firstOrFail();
            $lockedQuestion->status = QuestionStatus::DISABLED;
            $lockedQuestion->save();
            $process->start();

            $backendPid = null;
            for ($attempt = 0; $attempt < 300 && $backendPid === null; $attempt++) {
                $output .= $process->getIncrementalOutput();
                if (preg_match('/DBPID=(\d+)/', $output, $match)) {
                    $backendPid = (int) $match[1];
                } elseif (! $process->isRunning()) {
                    break;
                } else {
                    usleep(100000);
                }
            }
            $this->assertNotNull($backendPid, $output.' '.$process->getErrorOutput());

            for ($attempt = 0; $attempt < 100; $attempt++) {
                DB::statement('SELECT pg_stat_clear_snapshot()');
                $activity = DB::selectOne('SELECT wait_event_type FROM pg_stat_activity WHERE pid = ?', [$backendPid]);
                if ($activity?->wait_event_type === 'Lock') {
                    $blocked = true;
                    break;
                }
                usleep(100000);
            }
        } finally {
            DB::commit();
            if ($process->isRunning()) {
                $process->wait();
            }
            $output .= $process->getIncrementalOutput();
        }

        try {
            $this->assertTrue($blocked, 'Attach request must wait on the Question row lock. '.$output.' '.$process->getErrorOutput());
            $this->assertStringContainsString('STATUS=422', $output);
            $this->assertDatabaseCount('exam_questions', 0);
            $this->assertSame('0.00', Exam::findOrFail($exam->id)->total_points);
        } finally {
            // DatabaseTruncation keeps data visible to the worker; restore a clean test database.
            $this->artisan('migrate:fresh');
        }
    }
}
