import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

export type IndexRow = {
  index_symbol: string;
  index_name: string;
  currency: string;
  exchange_code: string;
  provider_guess: string;
  market_scope_guess: string;
  category_group: string;
  category: string;
  summary: string;
  stock_index_scope: string;
  source_dataset: string;
  source_url: string;
};

let cachedRows: IndexRow[] | null = null;

export function getAllIndices(): IndexRow[] {
  if (cachedRows) return cachedRows;

  const filePath = path.join(process.cwd(), "public", "world_stock_indices_equity_filtered.csv");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse<IndexRow>(raw, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse failure: ${parsed.errors[0]?.message ?? "Unknown error"}`);
  }

  cachedRows = parsed.data.map((row) => ({
    index_symbol: row.index_symbol ?? "",
    index_name: row.index_name ?? "",
    currency: row.currency ?? "",
    exchange_code: row.exchange_code ?? "",
    provider_guess: row.provider_guess ?? "",
    market_scope_guess: row.market_scope_guess ?? "",
    category_group: row.category_group ?? "",
    category: row.category ?? "",
    summary: row.summary ?? "",
    stock_index_scope: row.stock_index_scope ?? "",
    source_dataset: row.source_dataset ?? "",
    source_url: row.source_url ?? ""
  }));

  return cachedRows;
}

export function getFilterOptions(rows: IndexRow[]) {
  const dedupe = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

  return {
    providers: dedupe(rows.map((r) => r.provider_guess)).slice(0, 250),
    regions: dedupe(rows.map((r) => r.market_scope_guess)).slice(0, 250),
    exchanges: dedupe(rows.map((r) => r.exchange_code)).slice(0, 250)
  };
}
