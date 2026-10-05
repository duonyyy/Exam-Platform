/**
 * Commitlint Configuration for Exam Platform Monorepo
 * Enforces Conventional Commits 1.0.0 with custom domain scopes.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'security',
        'perf',
        'refactor',
        'test',
        'docs',
        'style',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        // Backend (core-api)
        'auth',
        'rbac',
        'subject',
        'topic',
        'question',
        'exam',
        'session',
        'assignment',
        'invigilation',
        'attempt',
        'answer',
        'scoring',
        'proctoring',
        'stats',
        'db',
        'policy',
        'api',
        'queue',

        // Frontend (web-client)
        'client',
        'web-auth',
        'exam-room',
        'timer',
        'autosave',
        'proctoring-collector',
        'teacher-portal',
        'admin-portal',
        'ui',

        // AI Agent (agentic-system)
        'agent',
        'langgraph',
        'tools',
        'prompt',

        // Cross-cutting / Infrastructure
        'repo',
        'docker',
        'ci',
        'deps',
        'docs',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
  },
};
