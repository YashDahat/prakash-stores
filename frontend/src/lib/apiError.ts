import axios from 'axios';

/**
 * Pull the human-readable reason out of an API failure. The backend's GlobalExceptionHandler
 * returns `{ message }` on 4xx/5xx (e.g. "Email already registered", "Insufficient stock…"),
 * so prefer that over axios's generic "Request failed with status code NNN". Falls back to the
 * raw Error message for network/other failures.
 */
export const getApiErrorMessage = (error: unknown, fallback = 'An unknown error occurred'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : fallback;
};
