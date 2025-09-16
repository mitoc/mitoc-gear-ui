import { ApprovalItem } from "src/apiClient/approvals";

import { GearLink } from "./GearLink";

/**
 * Renders a list of approval items (gear types or specific gear items)
 */
export function ApprovalItemsList({ items }: { items: ApprovalItem[] }) {
  return (
    <ul className="list-unstyled">
      {items.map((approvalItem) => {
        if (approvalItem.type === "gearType") {
          return (
            <li key={`${approvalItem.item.gearType.id}-type`}>
              {approvalItem.item.gearType.typeName} (
              {approvalItem.item.gearType.shorthand}){" "}
              <strong>x{approvalItem.item.quantity}</strong>
            </li>
          );
        }
        return (
          <li key={`${approvalItem.item.gearItem.id}-item`}>
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
