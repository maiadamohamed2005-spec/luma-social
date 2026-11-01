const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  errors: ValidationErrors;

  constructor(
    message: string,
    status: number,
    errors: ValidationErrors = {}
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      response.status,
      data.errors || {}
    );
  }

  return data as T;
}