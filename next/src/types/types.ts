// Advisor type from moneyfi.advisors table
export type Advisor = {
  id: number;
  name: string;
  description: string;
  full_bio: string;
  image_url: string | null;
};

// Message type from moneyfi.messages table
export type Message = {
  id: string;
  message: string;
  from_user: boolean;
  audio_url?: string;
  auto_play?: boolean;
};
