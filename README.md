# 🚬 Cigar Journal

A personal cigar tasting journal app with AI-powered cigar identification. Users can take a photo of a cigar band or search by name, and the app will auto-fill blend details, origin, strength, and size. Each user has their own private journal with star ratings and tasting notes.

## Tech Stack
- **Frontend:** Next.js (React)
- **Database & Auth:** Supabase
- **AI Identification:** Anthropic Claude API
- **Hosting:** Vercel

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/jwilkyson/Cigar-Journal.git
cd Cigar-Journal
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root:
```
NEXT_PUBLIC_SUPABASE_URL=https://tjzarxkwkyxhwgaooss.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Supabase Storage
In your Supabase dashboard:
1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name it `cigar-images`
4. Check **Public bucket**
5. Click **Create bucket**

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel
1. Push this code to your GitHub repo
2. Go to vercel.com → New Project → Import from GitHub
3. Add all 4 environment variables in Vercel's settings
4. Deploy!

## Features
- 📷 Photo scan — take a photo of any cigar band for AI identification
- 🔍 Text search — type a cigar name and auto-fill all details
- ⭐ Star ratings (1–5)
- 📝 Tasting notes
- 🔐 User accounts — each person's journal is private
- 📱 PWA — install on your phone home screen
- ☁️ Cloud sync — entries saved to database, accessible anywhere
