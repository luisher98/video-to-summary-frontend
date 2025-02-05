export type SummaryStatus = 'processing' | 'pending' | 'done' | 'error';

export interface SummaryProcessingUpdate {
  status: SummaryStatus;
  message: string;
}

export interface SummaryResponse extends SummaryProcessingUpdate {
  error?: string;
  progress?: number;
} 