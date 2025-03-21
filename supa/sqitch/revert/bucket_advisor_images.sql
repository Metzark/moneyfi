-- Revert moneyfi:bucket_advisor_images from pg

BEGIN;

DELETE FROM storage.buckets WHERE id = 'advisors_images';

COMMIT;
