export type FileUploadType =
  | { imageUrl: string; error?: never }
  | { error: string; imageUrl?: never };
