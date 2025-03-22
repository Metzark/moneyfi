// Advisor type from public.advisors table
export type Advisor = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
};

// Advisors response type
export type AdvisorsResponse = {
  data: Advisor[] | null;
  error: Error | null;
};

// Message type from public.messages table
export type Message = {
  id: string;
  message: string;
  from_user: boolean;
  audio_url?: string;
  auto_play?: boolean;
};
