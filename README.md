# Mohith's Portfolio

A full-stack personal portfolio with a built-in CMS admin panel — built with Next.js 16, Prisma, Supabase, and NextAuth.

---

## ✨ Features

- **Dynamic content** — every section (hero, projects, skills, blogs, etc.) is managed through the admin panel, no code changes needed
- **Admin CMS** — secure dashboard to create, edit, and delete all portfolio content
- **Authentication** — JWT-based login with bcrypt password hashing and CSRF protection
- **Glass-morphism UI** — smooth animations powered by Framer Motion
- **Type-safe** — full TypeScript coverage with Zod validation on all API inputs
- **Structured logging** — every API error is logged with context for easy debugging
- **Production-ready** — CSP headers, origin validation, secure cookies, rate-limiting ready

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 6 |
| Auth | NextAuth.js v4 |
| Animations | Framer Motion |
| Validation | Zod |
| Styling | CSS Modules + CSS Variables |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # CMS dashboard (protected)
│   ├── api/            # REST API routes
│   ├── blogs/          # Public blog pages
│   ├── projects/       # Public projects archive
│   └── achievements/   # Public achievements archive
├── components/         # Public-facing UI sections
├── lib/                # Auth, Prisma client, security utils, logger
├── styles/             # Shared admin style constants
└── types/              # TypeScript model interfaces
prisma/
├── schema.prisma       # Database schema
├── migrations/         # Migration history
└── seed.ts             # Sample data seeder
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone & install

```bash
git clone https://github.com/venkat-karthik/mohith-portfolio.git
cd mohith-portfolio
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
# Supabase (Session Pooler URL — use for IPv4 networks)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-x-xx-x.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-x-xx-x.pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-random-secret"   # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Admin seed credentials
ADMIN_SEED_USERNAME="admin"
ADMIN_SEED_PASSWORD="your-strong-password"
```

### 3. Push schema & seed data

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

---

## 🔐 Admin Panel

The admin panel lives at `/admin` and is protected by NextAuth session auth.

| Section | What you can manage |
|---|---|
| Hero | Name, tagline, CTA buttons, availability status |
| About | Bio text, profile image |
| Projects | Title, description, tech stack, links, pinning |
| Skills | Categories and individual skills |
| Timeline | Education, internships, milestones |
| Achievements | Awards, certifications, hackathon wins |
| Blogs | Full blog posts with publish/draft toggle |
| Testimonials | Quotes and author details |
| Contact | Email, LinkedIn, GitHub, Twitter |

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env` in the Vercel dashboard
4. Set `NEXTAUTH_URL` to your production domain
5. Deploy

After first deploy, run the seed once to create your admin user:

```bash
ADMIN_SEED_USERNAME=admin ADMIN_SEED_PASSWORD=yourpassword npx prisma db seed
```

---

## 📜 Scripts

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npx prisma studio  # Open Prisma database GUI
npx prisma db seed # Seed sample data
```

---

## 🔒 Security Highlights

- CSRF protection via `X-Requested-With` header + origin validation
- All inputs validated with Zod schemas before hitting the database
- CUID validation on all resource IDs
- Bcrypt password hashing (cost factor 12)
- JWT sessions with 8-hour max age
- Content Security Policy headers
- `X-Frame-Options: DENY`
- No secrets in client-side code

---

## 📄 License

MIT — feel free to use this as a base for your own portfolio.
