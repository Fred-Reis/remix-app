import {
  TextBlock,
  TextContainer,
  Tiles,
} from "@shopify/post-purchase-ui-extensions-react";
import { formatCurrency } from "../utils/functions";

export function MoneySummary({ label, amount }) {
  return (
    <Tiles>
      <TextBlock size="medium" emphasized>
        {label}
      </TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="medium">
          {formatCurrency(amount)}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
}
