
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
}

export interface UserRegistration {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  sheet: string;
  status: string;
  timestamp: string;
}

export interface EventForm {
  id: string;
  name: string;
  fields: { label: string; type: 'text' | 'number' | 'email' }[];
}

export enum AdminTab {
  TESTS = 'tests',
  BOT = 'bot',
  EVENTS = 'events',
  STATS = 'stats'
}
