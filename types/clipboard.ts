export interface ClipboardContent {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
  contentType?: string;
  views?: number;
}

export interface CreateClipboardRequest {
  content: string;
  contentType?: string;
}

export interface CreateClipboardResponse {
  id: string;
  shortUrl: string;
  qrCodeData: string;
  expiresAt: number;
}

export interface ApiError {
  error: string;
  code: string;
}