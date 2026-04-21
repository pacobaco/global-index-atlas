"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  index_symbol: string;
  index_name: string;
  currency: string;
  exchange_code: string;
  provider_guess: string;
  market_scope_guess: string;
  category: string;
  summary: string;
};

type ApiPayload = {
  meta: { total: number; page: number; pageSize: number; totalPages: number };
  filters: { providers: string[]; regions: string[]; exchanges: string[] };
  items: Row[];
};

type Stats = {
  total_indices: number;
  distinct_regions: number;
  distinct_providers: number;
  distinct_exchanges: number;
  top_regions: { name: string; count: number }[];
  top_providers: { name: string; count: number }[];
};

export default function DashboardClient({ stats }: { stats: Stats }) {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [region, setRegion] = useState("");
  const [exchange, setExchange] = useState("");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (provider) params.set("provider", provider);
    if (region) params.set("region", region);
    if (exchange) params.set("exchange", exchange);
    params.set("page", String(page));
    params.set("pageSize", "25");
    return params.toString();
  }, [search, provider, region, exchange, page]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/indices?${queryString}`)
      .then((res) => res.json())
      .then((data: ApiPayload) => {
        if (!ignore) setPayload(data);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [queryString]);

  useEffect(() => {
    setPage(1);
  }, [search, provider, region, exchange]);

  return (
    <>
      <section className="hero">
        <div className="panel">
          <div className="badge">Dashboard</div>
          <h2>Searchable index universe</h2>
          <p className="muted">
            Browse the global equity index dataset with API-backed filtering over symbol, name, provider, region, and exchange.
          </p>
          <div className="controls">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search index name, symbol, provider, region..." />
            <select value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="">All providers</option>
              {payload?.filters.providers.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All regions</option>
              {payload?.filters.regions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
              <option value="">All exchanges</option>
              {payload?.filters.exchanges.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={() => { setSearch(""); setProvider(""); setRegion(""); setExchange(""); setPage(1); }}>Reset</button>
          </div>
        </div>

        <div className="panel">
          <div className="badge">Repo description</div>
          <h2>Global Stock Index Atlas</h2>
          <p className="muted">
            Next.js dashboard + graph explorer for an 80K+ equity index dataset, with API routes, search, filtering, and Vercel-ready deployment.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <a className="badge" href="/graph">Open graph view</a>
            <a className="badge" href="/world_stock_indices_equity_filtered.csv">Download CSV</a>
            <a className="badge" href="/api/indices?page=1&pageSize=5">Sample API</a>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="panel card"><h3>Total indices</h3><div className="metric">{stats.total_indices.toLocaleString()}</div></div>
        <div className="panel card"><h3>Regions</h3><div className="metric">{stats.distinct_regions.toLocaleString()}</div></div>
        <div className="panel card"><h3>Providers</h3><div className="metric">{stats.distinct_providers.toLocaleString()}</div></div>
        <div className="panel card"><h3>Exchanges</h3><div className="metric">{stats.distinct_exchanges.toLocaleString()}</div></div>
      </section>

      <section className="smallgrid">
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Top regions</h3>
          <ol className="list">
            {stats.top_regions.map((item) => <li key={item.name}>{item.name} — {item.count.toLocaleString()}</li>)}
          </ol>
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Top providers</h3>
          <ol className="list">
            {stats.top_providers.map((item) => <li key={item.name}>{item.name} — {item.count.toLocaleString()}</li>)}
          </ol>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Results</h2>
            <div className="muted">
              {loading ? "Loading..." : `${payload?.meta.total.toLocaleString() ?? 0} matching rows`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
            <button onClick={() => setPage((p) => Math.min(payload?.meta.totalPages ?? p, p + 1))}>Next</button>
          </div>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Index name</th>
                <th>Provider</th>
                <th>Region</th>
                <th>Exchange</th>
                <th>Currency</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {payload?.items.map((row) => (
                <tr key={`${row.index_symbol}-${row.index_name}`}>
                  <td>{row.index_symbol}</td>
                  <td>
                    <div>{row.index_name}</div>
                    <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>{row.summary?.slice(0, 150)}{row.summary?.length > 150 ? "..." : ""}</div>
                  </td>
                  <td>{row.provider_guess}</td>
                  <td>{row.market_scope_guess}</td>
                  <td>{row.exchange_code}</td>
                  <td>{row.currency}</td>
                  <td>{row.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="muted" style={{ marginTop: 12 }}>
          Page {payload?.meta.page ?? 1} of {payload?.meta.totalPages ?? 1}
        </div>
      </section>
    </>
  );
}
