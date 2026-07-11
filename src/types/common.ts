/**
 * ZORIQ — Common Utility Types
 */

/** Make specific keys optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific keys required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/** Extract the resolved type of a Promise */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** File processing result */
export interface ProcessingResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  processedSize?: number;
  outputUrl?: string;
  outputBlob?: Blob;
  error?: string;
  processingTimeMs: number;
}

/** Component with children prop */
export interface WithChildren {
  children: React.ReactNode;
}

/** Component with className prop */
export interface WithClassName {
  className?: string;
}

/** Common component props */
export interface BaseComponentProps extends WithClassName {
  id?: string;
}
