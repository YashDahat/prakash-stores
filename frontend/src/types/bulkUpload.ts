// Result returned by the admin bulk-import endpoints (mirrors backend BulkUploadResult).

export interface BulkUploadRowError {
  row: number;
  message: string;
}

export interface BulkUploadResult {
  created: number;
  skipped: number;
  failed: number;
  errors: BulkUploadRowError[];
}
