export interface ApiResponse {
  status: "success" | "error";
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details: unknown;
  };
}
