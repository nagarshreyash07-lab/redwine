# RÉDWÍNE — MERN + Firebase

Animated, responsive technology-company website with a real backend and a private admin workspace.

**Stack:** React 19 · Vite · CSS Modules · Framer Motion · Express 5 · MongoDB/Mongoose · Firebase Auth

## Quick start
```bash
npm run install:all
cp client/.env.example client/.env      # Firebase web config + VITE_API_URL
cp server/.env.example server/.env      # MongoDB, Firebase Admin, ADMIN_EMAILS
npm run seed --prefix server            # optional: sample projects & insights
npm run dev                             # client :5173, API :5000
```
The public site works even if the API is offline (it falls back to bundled content).

## Firebase
1. Create a project → add a Web App → copy its config into `client/.env`.
2. Authentication → enable **Email/Password** and **Google**; add `localhost` to Authorized domains.
3. Service account (Project settings → Service accounts): set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON path (keep it outside the repo) **or** `FIREBASE_SERVICE_ACCOUNT_JSON` in a secure host.

## Admin access
Decided on the **server only**. A user is admin if either:
- their **verified** email is listed in `ADMIN_EMAILS` (comma-separated), or
- they have the Firebase custom claim `{ admin: true }`.

Sign in at `/login` → `/admin` to manage projects, insights and contact messages.

## Project structure
```
client/src
  components/
    layout/      Navbar, Footer, analytics consent/tracking, ScrollProgress, SiteLayout
    sections/    Hero, About, Capabilities, Projects, Manifesto, Process, Insights, Contact
    ui/          Button, Reveal, SectionHeading, Counter, Marquee
    graphics/    ParticleField (canvas), HeroOrb (CSS 3D), ProjectArt (generative SVG)
    admin/       Overview, AnalyticsDashboard, ResourceManager, MessagesInbox
  pages/         Home, Login, Profile, Admin, NotFound
  hooks/         useContent (API + fallback), useActiveSection
  data/          content.js  ← default copy, stats, sample projects
  context/       AuthContext (Firebase + server-side isAdmin)
  services/      api.js, analytics.js
server/src
  config/ models/ (including anonymous analytics) controllers/ middleware/ routes/ utils/ seed.js
```

## API
| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | public |
| GET | `/api/projects`, `/api/projects/:slug`, `/api/insights` | public (published only) |
| POST | `/api/contact` | public, rate-limited (5/hr), honeypot, validated |
| POST | `/api/analytics/consent` · `/api/analytics/events` | public, rate-limited; activity requires visitor consent |
| GET | `/api/users/me` | signed-in → `{ user, isAdmin }` |
| GET | `/api/admin/stats` | admin |
| GET | `/api/admin/analytics?days=7\|30\|90\|365` | admin |
| DELETE | `/api/admin/analytics/events` | admin; clears recorded activity, retains consent preferences |
| GET | `/api/admin/users?page=1&limit=20&search=` | admin; paginated account and last sign-in directory |
| GET/POST | `/api/admin/projects` · `/api/admin/insights` | admin |
| PATCH/DELETE | `/api/admin/projects/:id` · `/api/admin/insights/:id` | admin |
| GET | `/api/admin/messages` | admin |
| PATCH/DELETE | `/api/admin/messages/:id` | admin |

Security: Helmet, CORS allow-list, 100 kb body limit, global + contact + analytics rate limits, whitelisted fields on every write.

## Privacy-friendly analytics
Analytics is disabled until a visitor opts in using the consent panel or the footer's **Privacy & analytics** setting. It records anonymous page and section views, navigation and content clicks, selected site-control interactions, and the count of successful contact submissions. Analytics requests are sent without Firebase credentials; records contain no form contents, names, email addresses, IP addresses, content titles, or query strings. Visitors can withdraw consent, which deletes their recorded activity. Records do not expire automatically; an admin can clear all activity from the Analytics dashboard. Visitor consent preferences remain saved when event data is cleared.

## Customising
- Copy, stats and sample projects: `client/src/data/content.js` (and `server/src/seed.js`).
- Colours, fonts, spacing: `client/src/styles/variables.css`.
- Animations respect `prefers-reduced-motion`.

## Before going live
- Replace the **placeholder stats and sample projects/insights** with real ones.
- Set `CLIENT_ORIGIN` to your production domain and add it to Firebase Authorized domains.
- Contact messages are stored in MongoDB; add email notification (e.g. Resend/SendGrid) if you want alerts.
- Add tests, SEO/OG image and your deployment pipeline. Review analytics consent and retention copy for your jurisdiction before launch.
