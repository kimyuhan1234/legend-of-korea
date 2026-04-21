CREATE TABLE IF NOT EXISTS food_image_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_name_ko TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('pexels', 'unsplash', 'tour_api', 'placeholder')),
  photographer TEXT,
  photographer_url TEXT,
  query_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_image_cache_name ON food_image_cache(food_name_ko);

ALTER TABLE food_image_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read food_image_cache"
  ON food_image_cache FOR SELECT USING (true);

CREATE POLICY "Service role write food_image_cache"
  ON food_image_cache FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
