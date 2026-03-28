/* 
# AXiM Operational Schema
1. New Tables
  - `user_profiles_1774676062318`
    - `id` (uuid, primary key)
    - `wallet_address` (text, unique)
    - `clearance_level` (int, default 1)
    - `created_at` (timestamp)
  - `demand_letters_1774676062318`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key)
    - `recipient` (text)
    - `claim_amount` (numeric)
    - `status` (text, default 'draft')
    - `content_json` (jsonb)
    - `created_at` (timestamp)

2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own records
*/

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles_1774676062318 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  clearance_level int DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles_1774676062318 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON user_profiles_1774676062318 FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Demand Letters
CREATE TABLE IF NOT EXISTS demand_letters_1774676062318 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles_1774676062318(id),
  recipient text NOT NULL,
  claim_amount numeric DEFAULT 0,
  status text DEFAULT 'draft',
  content_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demand_letters_1774676062318 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own letters" 
ON demand_letters_1774676062318 FOR ALL 
TO authenticated 
USING (user_id IN (SELECT id FROM user_profiles_1774676062318 WHERE auth.uid() = id));