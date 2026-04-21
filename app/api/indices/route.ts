import { getAllIndices, getFilterOptions } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const provider = (searchParams.get("provider") ?? "").trim();
  const region = (searchParams.get("region") ?? "").trim();
  const exchange = (searchParams.get("exchange") ?? "").trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "25")));

  let rows = getAllIndices();

  if (search) {
    rows = rows.filter((row) =>
      [row.index_name, row.index_symbol, row.summary, row.provider_guess, row.market_scope_guess]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }
  if (provider) rows = rows.filter((row) => row.provider_guess === provider);
  if (region) rows = rows.filter((row) => row.market_scope_guess === region);
  if (exchange) rows = rows.filter((row) => row.exchange_code === exchange);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = rows.slice(start, end);

  return Response.json({
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    },
    filters: getFilterOptions(getAllIndices()),
    items
  });
}
