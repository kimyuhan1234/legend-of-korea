CREATE TABLE IF NOT EXISTS community_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'JP',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  cooking_time INTEGER DEFAULT 30,
  servings INTEGER DEFAULT 2,
  description TEXT,
  photos JSONB DEFAULT '[]',
  korean_ingredients JSONB DEFAULT '[]',
  foreign_ingredients JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes" ON community_recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert own recipes" ON community_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON community_recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON community_recipes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_recipes_country ON community_recipes (country_code);
CREATE INDEX idx_recipes_created ON community_recipes (created_at DESC);
