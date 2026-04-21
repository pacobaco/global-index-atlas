# Global Index Atlas NextGraph

**Description:** Global Stock Index Atlas — Next.js dashboard + graph explorer for an 80K+ equity index dataset, with API routes, search, filtering, and Vercel-ready deployment.

## Repo name
`global-index-atlas-nextgraph`

## What it includes
- Next.js App Router application
- `/api/indices` route handler for paging, search, region, provider, and exchange filters
- `/api/graph` route handler for provider-to-region graph data
- Home dashboard with summary cards and preview table
- `/graph` interactive network page powered by `react-force-graph-2d`
- Real CSV in `/public/world_stock_indices_equity_filtered.csv`

## Install
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Vercel deployment
1. Push this repo to GitHub
2. Import it into Vercel
3. Framework preset: Next.js
4. Build command: `next build`
5. No extra environment variables required

## API examples
```bash
curl "http://localhost:3000/api/indices?page=1&pageSize=25"
curl "http://localhost:3000/api/indices?search=Nasdaq&provider=NASDAQ"
curl "http://localhost:3000/api/graph"
```

## Notes
The source CSV is large. The app caches parsed results in-process to avoid reparsing on every request during a single runtime lifecycle.
