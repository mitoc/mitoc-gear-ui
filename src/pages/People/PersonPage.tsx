import { useParams } from "react-router-dom";

export function PersonPage() {
  const { personId } = useParams<{ personId: string }>();
  return <span>This is the person {personId} page</span>;
}
