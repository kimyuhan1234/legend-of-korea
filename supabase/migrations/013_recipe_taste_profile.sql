ALTER TABLE community_recipes
  ADD COLUMN IF NOT EXISTS taste_profile JSONB DEFAULT '{"sweet":0,"salty":0,"spicy":0,"sour":0,"umami":0}';
