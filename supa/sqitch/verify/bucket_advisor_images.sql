-- Verify moneyfi:bucket_advisor_images on pg

BEGIN;

DO $$
BEGIN
   ASSERT EXISTS(
      SELECT 1 
      FROM storage.buckets 
      WHERE id = 'advisors_images'
   ), 'Bucket advisors_images does not exist';
END $$;

ROLLBACK;
