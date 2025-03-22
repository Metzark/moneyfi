-- Deploy moneyfi:bucket_advisor_audio to pg

BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('advisor_audio', 'advisor_audio', true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'advisor_audio'
);

-- Allow public to read files
CREATE POLICY "Allow public to read files"
ON storage.objects FOR SELECT TO public
USING (
    bucket_id = 'advisor_audio'
);

COMMIT;
