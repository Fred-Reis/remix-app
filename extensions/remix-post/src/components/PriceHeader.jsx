import {
  Text,
  TextContainer,
} from "@shopify/post-purchase-ui-extensions-react";
import { formatCurrency } from "../utils/functions";

export function PriceHeader({
  discountedPrice,
  originalPrice,
  loading,
  discount,
}) {
  return (
    <TextContainer alignment="leading" spacing="loose">
      <Text emphasized size="large">
        {" "}
        {!loading && formatCurrency(discountedPrice)}
      </Text>{" "}
      <Text role="deletion" size="small">
        {!loading && originalPrice}
      </Text>{" "}
      <Text size="medium" appearance="success">
        Save({!loading && discount}%)
      </Text>
    </TextContainer>
  );
}
