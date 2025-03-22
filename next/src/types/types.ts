export type Advisor = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
};

export type AdvisorsResponse = {
  data: Advisor[] | null;
  error: Error | null;
};

export type Message = {
  id: string;
  message: string;
  from_user: boolean;
  audio_url?: string;
};
