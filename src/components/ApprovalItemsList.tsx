import { ApprovalItem } from "apiClient/approvals";
import { GearLink } from "components/GearLink";

/**
 * Renders a list of approval items (gear types or specific gear items)
 */
export function ApprovalItemsList({
  items,
  keyPrefix = "",
}: {
  items: ApprovalItem[];
  keyPrefix?: string;
}) {
  return (
    <ul>
      {items.map((approvalItem, index) => {
        const key = keyPrefix ? `${keyPrefix}-${index}` : index;

        if (approvalItem.type === "gearType") {
          return (
            <li key={`${approvalItem.item.gearType.id}-${key}`}>
              {approvalItem.item.gearType.typeName} (
              {approvalItem.item.gearType.shorthand}) -
              {approvalItem.item.quantity}{" "}
              {approvalItem.item.quantity > 1 ? "items" : "item"}
            </li>
          );
        }
        return (
          <li key={`${approvalItem.item.gearItem.id}-${key}`}>
            {approvalItem.item.gearItem.type.typeName} -{" "}
            <GearLink id={approvalItem.item.gearItem.id}>
              {approvalItem.item.gearItem.id}
            </GearLink>
          </li>
        );
      })}
    </ul>
  );
}
