# DSA checklist (codestorywithMIK)

Track which codestorywithMIK DSA videos you've finished. Each playlist has its own route,
e.g. `/sliding-window`, `/binary-search`, `/dynamic-programming`.
Ticks are saved in the browser's localStorage, so they're still there next time.

## Run
    npm install
    npm run dev        # http://localhost:3000

## Deploy
`npm run build` makes a static site in `out/` (output: "export").
Push to GitHub and import into Vercel/Netlify, or upload `out/` anywhere.

## Edit playlists
Everything lives in `lib/playlists.ts`.
- `videos: [1, 3, 4]` -> one checkbox per video number
- `videos: "all"`     -> one checkbox for the whole playlist
- `range(1, 10)`      -> videos 1 to 10
- add `url: "https://www.youtube.com/playlist?list=..."` to link the real playlist
  (otherwise "Open on YouTube" runs a YouTube search)
