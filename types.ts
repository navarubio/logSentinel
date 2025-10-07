
export enum LogType {
  None = "None",
  Payara = "Payara",
  PostgreSQL = "PostgreSQL",
  Sensors = "Sensors",
}

export interface LogEntry {
  id: number;
  original: string;
  isError: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
