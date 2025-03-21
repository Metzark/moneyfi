-- Deploy moneyfi:bucket_advisor_images to pg

BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('advisors_images', 'advisors_images', true);

COMMIT;
