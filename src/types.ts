export type Mode = 'generate' | 'edit' | 'scene' | 'ideas';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type ImageQuality = 'standard' | 'hd';

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface HistoryItem {
  id: string;
  type: Mode;
  timestamp: number;
  data: string; // base64 for image, markdown for text
  prompt: string;
  thumbnail: string; // base64 for image, truncated text for text
}
