# Folio — React frontend

A complete React frontend for the Blog-System API: auth, feed, posts, comments,
likes, follow/followers, profile settings, and an admin panel. Light/dark theme,
built with Vite + React Router (no other UI framework).

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

By default the app talks to `http://localhost:1912`. To point it elsewhere,
either:

- Copy `.env.example` to `.env` and set `VITE_API_BASE_URL`, or
- Just run the app and click the "API: ..." link in the footer — it's saved
  in your browser's local storage, no rebuild needed.

Make sure the Spring Boot backend is running (and has CORS enabled — see the
`Blog-System-fixed.zip` from earlier if you haven't applied those fixes yet).

## Build for deployment

```bash
npm run build
```

Outputs a static site to `dist/`. Because routing uses `HashRouter`, `dist/`
can be served from any static host (or opened as plain files) with zero
server-side rewrite configuration.

## Project structure

```
src/
  api/          fetch wrapper, localStorage helpers, one function per endpoint
  context/      Auth, Theme, Toast, Confirm-dialog providers
  components/   Navbar, Layout, EntryCard, comment UI, route guards, icons…
  hooks/        useLikeToggle (optimistic like/unlike)
  pages/        one file per route
  utils/        formatting helpers (time-ago, excerpt, read time…)
```

## Covered endpoints

Every backend route has a matching function in `src/api/endpoints.js`:
`authApi`, `blogApi`, `commentApi`, `likeApi`, `followApi`, `userApi`, `adminApi`.
