-- Verify moneyfi:bucket_advisor_audio on pg

BEGIN;

DO $$
BEGIN
   ASSERT EXISTS(
      SELECT 1 
      FROM storage.buckets 
      WHERE id = 'advisors_images'
   ), 'Bucket advisor_audio does not exist';
END $$;

ROLLBACK;
