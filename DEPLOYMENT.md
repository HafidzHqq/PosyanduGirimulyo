# Deploy Posyandu Girimulyo

## 1. Supabase

1. Buat project baru di Supabase.
2. Login CLI:

```bash
npx supabase login
```

3. Link project:

```bash
npx supabase link --project-ref PROJECT_REF_SUPABASE
```

4. Jalankan migration tabel histori:

```bash
npx supabase db push
```

5. Ambil PostgreSQL connection string dari Supabase, lalu gunakan sebagai `DATABASE_URL`.

## 2. Vercel

1. Login CLI:

```bash
npx vercel login
```

2. Set environment variable production:

```bash
npx vercel env add DATABASE_URL production
npx vercel env add DATABASE_SSL production
```

Isi:

```bash
DATABASE_SSL=true
```

3. Deploy production:

```bash
npx vercel --prod
```

## Catatan

- Gunakan connection string Supabase PostgreSQL yang menyertakan password database.
- Jangan commit `.env.local`.
- File migration ada di `supabase/migrations/`.
