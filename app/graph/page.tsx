import GraphClient from "@/components/GraphClient";
import graph from "@/public/graph.json";

export default function GraphPage() {
  return <GraphClient initial={graph} />;
}
