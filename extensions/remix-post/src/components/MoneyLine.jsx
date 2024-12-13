import {
  TextBlock,
  TextContainer,
  Tiles,
} from "@shopify/post-purchase-ui-extensions-react";
import { formatCurrency } from "../utils/functions";

export function MoneyLine({ label, amount, loading = false }) {
  return (
    <Tiles>
      <TextBlock size="medium">{label}</TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="medium">
          {loading ? "-" : formatCurrency(amount)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}
