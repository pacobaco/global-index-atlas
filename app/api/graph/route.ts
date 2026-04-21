export const dynamic = "force-dynamic";

export async function GET() {
  const mod = await import("@/public/graph.json");
  return Response.json(mod.default);
}
