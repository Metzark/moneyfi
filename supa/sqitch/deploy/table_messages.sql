-- Deploy moneyfi:table_messages to pg

BEGIN;

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_id INT NOT NULL REFERENCES advisors(id),
    user_id UUID REFERENCES auth.users(id),
    from_user BOOLEAN NOT NULL,
    message TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


ALTER publication supabase_realtime ADD TABLE public.messages;

COMMIT;
