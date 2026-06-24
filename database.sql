CREATE TABLE IF NOT EXISTS nutrition_histories (
  id BIGSERIAL PRIMARY KEY,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  nik_anak VARCHAR(16),
  nama_anak TEXT NOT NULL,
  nik_ibu VARCHAR(16),
  nama_ibu TEXT,
  jenis_kelamin VARCHAR(1) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  usia TEXT NOT NULL,
  usia_bulan INTEGER,
  berat NUMERIC(6,2) NOT NULL,
  tinggi NUMERIC(6,2) NOT NULL,
  imt NUMERIC(6,2),
  is_stunted BOOLEAN NOT NULL,
  stunting_conclusion TEXT,
  wfa_z NUMERIC(6,2) NOT NULL,
  wfa_status TEXT NOT NULL,
  wfa_level TEXT,
  hfa_z NUMERIC(6,2) NOT NULL,
  hfa_status TEXT NOT NULL,
  hfa_level TEXT,
  wfh_z NUMERIC(6,2) NOT NULL,
  wfh_status TEXT NOT NULL,
  wfh_level TEXT,
  bmifa_z NUMERIC(6,2) NOT NULL,
  bmifa_status TEXT NOT NULL,
  bmifa_level TEXT,
  result_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE nutrition_histories
  ADD COLUMN IF NOT EXISTS usia_bulan INTEGER,
  ADD COLUMN IF NOT EXISTS imt NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS stunting_conclusion TEXT,
  ADD COLUMN IF NOT EXISTS wfa_level TEXT,
  ADD COLUMN IF NOT EXISTS hfa_level TEXT,
  ADD COLUMN IF NOT EXISTS wfh_level TEXT,
  ADD COLUMN IF NOT EXISTS bmifa_level TEXT,
  ADD COLUMN IF NOT EXISTS session_date DATE NOT NULL DEFAULT CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_nutrition_histories_created_at
  ON nutrition_histories (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nutrition_histories_nama_anak
  ON nutrition_histories (nama_anak);

CREATE INDEX IF NOT EXISTS idx_nutrition_histories_session_date
  ON nutrition_histories (session_date DESC);
