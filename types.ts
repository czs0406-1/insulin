
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface InsulinType {
  id: string;
  name: string;
  onset: string;
  peak: string;
  duration: string;
  description: string;
  color: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}
