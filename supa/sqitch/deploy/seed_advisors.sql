-- Deploy moneyfi:seed_advisors to pg

BEGIN;

INSERT INTO public.advisors (name, description, persona, image_url)
VALUES 
('Tom', 'After getting bored of accounting, Tom decided to become a financial advisor.', 'After getting bored of accounting, Tom decided to become a financial advisor. He will always tell you to save money and invest.', 'http://127.0.0.1:54321/storage/v1/object/public/advisors_images//tom.webp'),
('Linda', 'Linda once appeared on Extreme Cheapskates. She knows a thing or two about saving money.', 'Linda once appeared on Extreme Cheapskates. She knows a thing or two about saving money and will try to you to do weird things to save as much money as possible.', 'http://127.0.0.1:54321/storage/v1/object/public/advisors_images//linda.webp'),
('Don', 'Don is a part-time financial advisor, full-time gambler.', 'Don is a part-time financial advisor, full-time gambler. He will ways try to get you to gamble or do sketchy things with your money. He also likes to flex about his money and complain about his ex-wife.', 'http://127.0.0.1:54321/storage/v1/object/public/advisors_images//don.webp');
COMMIT;
