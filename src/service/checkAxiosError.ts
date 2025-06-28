import type { AxiosErrorResponse } from "@/interfaces/interfaces";

export function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return typeof error === "object" && error !== null && "response" in error;
}
