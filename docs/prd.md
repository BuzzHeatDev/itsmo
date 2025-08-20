You are an expert Next.js engineer. Build a production-ready MVP for IsTheStockMarketOpen.io with the following spec. Version = v1 (NO Stripe). Stack: Next.js (App Router, TypeScript), Supabase (Postgres + Auth), Resend (contact form), OpenAI (optional quips toggle, can be stubbed), Vercel deploy, AdSense + Buy Me a Coffee links. Emphasis on performance, accessibility, and a clean card UI.

1) App goals

A public homepage that answers: “Is the stock market open?” Show a ranked list of markets as cards with:
	•	Flag, Market name, City/Timezone
	•	Status pill: OPEN (green), CLOSED (red), LUNCH (amber if applicable)
	•	Countdown to next change (hh:mm, no seconds): “closes in…”, “opens in…”, “lunch in…”, “reopens in…”
	•	Handle weekday hours, lunch breaks, holidays/half-days, and time zones/DST correctly.

A protected /admin dashboard (Supabase Auth) to CRUD markets, sessions, holidays, and site settings. NO Stripe in v1.

2) Pages & routes

Public:
	•	/ Main Dashboard (market cards + ads + BuyMeACoffee button)
	•	/privacy (must mention cookies, AdSense/third-party ads)
	•	/about
	•	/contact (form -> Resend email to site owner)
	•	/terms (optional: generate basic template + link in footer)

Protected (admin):
	•	/admin (requires Supabase email/password login)
	•	Markets list (sortable by tier & position)
	•	Market editor (name, short name, country, flag, city, IANA timezone, tier, active)
	•	Sessions editor (weekday rows; open_time, close_time; lunch toggle + lunch_open_time, lunch_close_time)
	•	Holidays editor (date, name, closed_all_day boolean; optional open/close time overrides for half-days)
	•	Settings (adsense_client_id, buymeacoffee_url, contact_forward_email, show_openai_quips boolean)
	•	Preview panel: show computed status & countdown for selected market, with “mock now” control

3) Data model (Supabase)

Create SQL migrations and typed Supabase client hooks.

tables.markets
	•	id (uuid, pk)
	•	slug (text unique)
	•	name (text)
	•	short_name (text)
	•	country (text)
	•	flag_emoji (text)
	•	city (text)
	•	timezone (text, IANA e.g. “America/New_York”)
	•	tier (int, default 2)  // 1 = major
	•	position (int, default 0)
	•	is_active (bool, default true)
	•	notes (text)

tables.sessions (regular weekly schedule)
	•	id (uuid, pk)
	•	market_id (uuid fk -> markets.id)
	•	weekday (int 0–6; 0=Sun)
	•	open_time (time)
	•	close_time (time)
	•	has_lunch_break (bool, default false)
	•	lunch_open_time (time, nullable)
	•	lunch_close_time (time, nullable)

tables.holidays
	•	id (uuid, pk)
	•	market_id (uuid fk)
	•	date (date) // local market date
	•	name (text)
	•	is_closed_all_day (bool, default true)
	•	open_time_override (time, nullable) // for half-days
	•	close_time_override (time, nullable)

tables.settings (singleton row)
	•	id (int pk default 1)
	•	adsense_client_id (text, nullable)
	•	buymeacoffee_url (text, nullable)
	•	contact_forward_email (text, nullable)
	•	show_openai_quips (bool, default false)

Seed with ~10 markets across US/UK/EU/Asia to demo (NYSE, NASDAQ, LSE, Euronext Paris, Xetra/Frankfurt, SIX Swiss, Tokyo, Hong Kong, ASX, NSE India). Include reasonable hours and at least 2 with lunch (JPX, HKEX). Include a few sample holidays.

4) Status engine (core logic)

Create a pure TypeScript utility lib/statusEngine.ts with tests. Inputs: market (timezone), weekday sessions, holidays, and now (UTC). Steps:
	1.	Convert now to market local time via IANA timezone.
	2.	Determine today’s effective schedule:
	•	If holiday with is_closed_all_day → CLOSED all day.
	•	Else if holiday has open_time_override or close_time_override, use those as today’s times (still honor lunch if configured).
	•	Else use the normal weekday session.
	3.	Build segments (local times):
	•	OPEN1: open_time → (lunch_open_time or close_time if no lunch)
	•	LUNCH: lunch_open_time → lunch_close_time (if exists)
	•	OPEN2: lunch_close_time → close_time (if exists)
	4.	Compare now_local to segments to yield status: OPEN, LUNCH, or CLOSED.
	5.	Compute next boundary:
	•	If in OPEN1 → next is lunch start or close.
	•	If in LUNCH → next is lunch end (reopen).
	•	If in OPEN2 → next is close.
	•	If CLOSED → find next trading day considering weekends & holidays; output the next open time.
	6.	Return { status, label, nextChangeAtLocal, remainingHHMM, todayTimeline }.
	•	Labels:
	•	OPEN → “closes in hh:mm” (or “lunch in hh:mm” if lunch ahead)
	•	LUNCH → “reopens in hh:mm”
	•	CLOSED → “opens in hh:mm”
	7.	No seconds; floor to minutes; update on the client every minute with a setInterval (cleanup on unmount).

Edge cases: DST transitions, half-days, post-close (roll to next valid trading day), missing sessions (treat as closed).

5) UI/UX requirements
	•	Minimal, fast, mobile-first. Use TailwindCSS.
	•	Market Card:
	•	Left: Flag circle, Market short name bold; under it: city + timezone small text.
	•	Right/top: Status pill with color + text (OPEN green, CLOSED red, LUNCH amber).
	•	Right/bottom: countdown line (e.g., “closes in 2h 13m”).
	•	Tap/hover expand reveals today’s schedule (open → lunch → reopen → close) and holiday note if today.
	•	Ordering: Tier 1 “Majors” first (NYSE/NASDAQ combined hours okay but keep as separate items), then others by tier then position.
	•	Accessibility: Do not rely on color alone; include text labels; aria-live polite for countdown.

6) Ads & donations (no CLS)
	•	Add Google AdSense placeholders with reserved height to avoid layout shift. Use client id from settings.
	•	Place one ad block below the page title, one mid-list, one near footer (responsive).
	•	Add Buy Me a Coffee button in header and mid-page using URL from settings.
	•	Implement a basic cookie consent banner: personalized/non-personalized toggle for AdSense in eligible regions (store in localStorage and expose to ad components).

7) Content pages (generate copy)
	•	/privacy: mention cookies (functional + ads), AdSense/third-party cookies, links to Google Ad Settings & partner list, opt-out info, data retention for contact form, last updated.
	•	/about: 2–3 short paragraphs about the site’s purpose.
	•	/contact: form with name, email, message; Resend API call; success + error states; also show the owner contact email from settings.
	•	/terms: basic template (non-binding sample).
	•	Footer links to Privacy, About, Contact, Terms.

8) Admin UX details
	•	Supabase Auth (email/password). Public pages do NOT require login.
	•	/admin
	•	Markets table view: search, filter by tier/active, drag-drop reorder within tier (persist position).
	•	Edit Market modal/page: all fields; inline Sessions editor (weekday rows with time pickers; lunch toggle reveals lunch times).
	•	Holidays tab: list, add/edit (date picker, name, closed_all_day, time overrides).
	•	Settings tab: adsense_client_id, buymeacoffee_url, contact_forward_email, show_openai_quips.
	•	Preview pane: pick a market, choose “mock now” datetime (defaults to now), show computed status and countdown exactly as the public card would display.
	•	After save, invalidate/revalidate the homepage data (ISR or on-demand revalidation). Keep homepage blazing fast (server fetch + minute-tick client countdown).

9) Architecture
	•	Next.js App Router, TypeScript, Tailwind.
	•	Data fetching via server components; cache market list (Edge runtime OK) and revalidate on change.
	•	Client countdown re-renders once per minute only.
	•	Utilities: lib/time.ts (TZ helpers), lib/statusEngine.ts (core logic + tests), lib/supabase.ts (server/client helpers), lib/adsense.tsx (safe ad wrapper with reserved slot).
	•	Testing: Jest or Vitest for status engine; Playwright happy-path for homepage + admin login + CRUD + preview.

10) Environment & config
	•	.env (use example file):
	•	NEXT_PUBLIC_SITE_NAME=IsTheStockMarketOpen
	•	NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Berlin
	•	NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
	•	SUPABASE_URL=...
	•	SUPABASE_SERVICE_ROLE=... (server only)
	•	SUPABASE_ANON_KEY=...
	•	RESEND_API_KEY=...
	•	OPENAI_API_KEY=... (optional)
	•	Provide a simple Settings seed row and a seed script for sample markets/sessions/holidays.

11) Acceptance criteria (v1)
	•	Public homepage loads <2s on mobile (no CLS spikes from ads due to reserved heights).
	•	Each card shows correct status and countdown for now in market’s local time, including lunch and sample holiday.
	•	Cookie banner controls AdSense personalization flag.
	•	Admin can CRUD markets/sessions/holidays/settings and see accurate Preview.
	•	Contact form sends email via Resend and displays success/error.
	•	No Stripe code present.

Deliver:
	•	Full Next.js app with the above pages/components.
	•	Supabase SQL migrations + seeds.
	•	Status engine with unit tests.
	•	Minimal, clean styling and accessible components.
	•	README with setup (Supabase, env, AdSense notes, Resend, Vercel deploy).