export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errorCode?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const isFormData = typeof FormData !== "undefined" && customConfig.body instanceof FormData;
  const headersInit: Record<string, string> = {
    Accept: "application/json",
  };
  if (!isFormData) {
    headersInit["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headersInit,
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "Đã xảy ra lỗi khi kết nối với máy chủ.";
    const errorCode = data?.error_code;
    const errors = data?.errors;

    throw new ApiError(response.status, message, errorCode, errors);
  }

  return data as T;
}

export async function downloadFileApi(
  endpoint: string,
  defaultFilename: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<void> {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errData?.message || "Không thể tải tệp tin từ hệ thống."
    );
  }

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = defaultFilename;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
