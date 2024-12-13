import { useEffect, useState } from "react";
import {
  extend,
  render,
  useExtensionInput,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Text,
  TextContainer,
  Separator,
  Tiles,
  TextBlock,
  Select,
  Radio,
  Banner,
  Layout,
} from "@shopify/post-purchase-ui-extensions-react";
import {
  formatCurrency,
  formatTime,
  getSelectedVariant,
  parsedOptions,
} from "./utils/functions";

const APP_URL =
  "https://fireplace-organize-nervous-background.trycloudflare.com";
const TIME_LEFT = 10;
const QUANTITY_OPTIONS = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

extend(
  "Checkout::PostPurchase::ShouldRender",
  async ({ inputData, storage }) => {
    const postPurchaseOffer = await fetch(`${APP_URL}/api/offer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inputData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referenceId: inputData.initialPurchase.referenceId,
      }),
    }).then((response) => response.json());

    await storage.update(postPurchaseOffer);

    return { render: true };
  },
);

render("Checkout::PostPurchase::Render", () => <App />);

export function App() {
  const { storage, inputData, calculateChangeset, applyChangeset, done } =
    useExtensionInput();
  const { offers } = storage.initialData;

  const purchaseOption = offers[1];

  const [calculatedPurchase, setCalculatedPurchase] = useState();
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
  const [selectedPlan, setSelectedPlan] = useState("one-time");
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(
    QUANTITY_OPTIONS[0].value,
  );

  const [selectedVariant, setSelectedVariant] = useState(
    purchaseOption.changes[0].variantID,
  );

  const [variantOptions, setVariantOptions] = useState(
    parsedOptions(purchaseOption.changes),
  );

  const [singleUnitPrice, setSingleUnitPrice] = useState();

  const isOfferActive = timeLeft > 0;

  useEffect(() => {
    if (!isOfferActive) {
      purchaseOption.changes = purchaseOption.changes.map((change) => ({
        ...change,
        discount: null,
      }));
    }

    async function calculatePurchase() {
      const variant = getSelectedVariant(
        purchaseOption.changes,
        selectedVariant,
      ).map((variant) => ({ ...variant, quantity: selectedQuantity }));

      const singleUnitVariant = getSelectedVariant(
        purchaseOption.changes,
        selectedVariant,
      );

      const result = await calculateChangeset({
        changes: variant,
      });

      const singleUnitResult = await calculateChangeset({
        changes: singleUnitVariant,
      });

      setSingleUnitPrice(singleUnitResult.calculatedPurchase);

      setCalculatedPurchase(result.calculatedPurchase);
      setLoading(false);
    }

    calculatePurchase();
  }, [
    calculateChangeset,
    purchaseOption.changes,
    isOfferActive,
    selectedVariant,
    selectedQuantity,
  ]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const shipping =
    calculatedPurchase?.addedShippingLines[0]?.priceSet?.presentmentMoney
      ?.amount;

  const taxes =
    calculatedPurchase?.addedTaxLines[0]?.priceSet?.presentmentMoney?.amount;

  const total = calculatedPurchase?.totalOutstandingSet.presentmentMoney.amount;

  const discount = purchaseOption.changes[0].discount?.value;

  const subTotal =
    calculatedPurchase?.updatedLineItems[0]?.totalPriceSet.presentmentMoney
      .amount;

  const discountedPrice =
    singleUnitPrice?.updatedLineItems[0]?.totalPriceSet.presentmentMoney.amount;

  const originalPrice =
    singleUnitPrice?.updatedLineItems[0]?.priceSet.presentmentMoney.amount;

  async function acceptOffer() {
    setLoading(true);

    const token = await fetch(`${APP_URL}/api/sign-changeset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inputData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referenceId: inputData.initialPurchase.referenceId,
        changes: purchaseOption.id,
        variantId: selectedVariant,
        quantity: selectedQuantity,
        offerActive: isOfferActive,
      }),
    })
      .then((response) => response.json())
      .then((response) => response.token)
      .catch((e) => console.error("Error signing changeset", e));

    await applyChangeset(token);

    done();
  }

  function declineOffer() {
    setLoading(true);
    done();
  }

  return (
    <BlockStack spacing="loose">
      <CalloutBanner>
        <BlockStack spacing="loose">
          <TextContainer>
            <Text size="small">Black Friday only!</Text>
          </TextContainer>
          <TextContainer>
            <Text size="medium" emphasized>
              Don't mis out! The perfect complement to{" "}
              {inputData.initialPurchase.lineItems[0].product.title}
            </Text>
          </TextContainer>
        </BlockStack>
      </CalloutBanner>

      <Layout
        media={[
          { viewportSize: "small", sizes: [0, 1, 0], maxInlineSize: 0.9 },
          { viewportSize: "medium", sizes: [0, 532, 0], maxInlineSize: 420 },
          { viewportSize: "large", sizes: [0, 938, 0] },
        ]}
      >
        <BlockStack />

        {isOfferActive && (
          <Banner status="warning" iconHidden>
            <TextContainer alignment="center">
              <Text size="small">
                Don't miss out -- your special offer ends in:
              </Text>
              <Text size="small" emphasized>
                {formatTime(timeLeft)}
              </Text>
            </TextContainer>
          </Banner>
        )}
        <BlockStack />
      </Layout>

      <Layout
        media={[
          { viewportSize: "small", sizes: [1, 0, 1], maxInlineSize: 0.9 },
          { viewportSize: "medium", sizes: [532, 0, 1], maxInlineSize: 420 },
          { viewportSize: "large", sizes: [450, 38, 450] },
        ]}
      >
        <Image
          loading="lazy"
          fit="contain"
          description="product photo"
          source={purchaseOption.productImageURL}
        />

        <BlockStack />

        <BlockStack>
          <Heading>{purchaseOption.productTitle}</Heading>
          <PriceHeader
            discountedPrice={discountedPrice}
            originalPrice={originalPrice}
            loading={!calculatedPurchase}
            discount={discount}
          />

          <TextBlock subdued>Surprise yourself! 😃</TextBlock>

          <Radio
            checked={selectedPlan === "one-time"}
            onChange={() => setSelectedPlan("one-time")}
          >
            One-time Purchase
          </Radio>
          <Radio
            checked={selectedPlan === "subscribe"}
            onChange={() => setSelectedPlan("subscribe")}
          >
            Subscribe and Save
          </Radio>

          <Select
            value={selectedVariant}
            onChange={(opt) => setSelectedVariant(Number(opt))}
            label="Size"
            options={variantOptions}
          />

          <Select
            value={selectedQuantity}
            onChange={(opt) => setSelectedQuantity(Number(opt))}
            label="Quantity"
            options={QUANTITY_OPTIONS}
          />

          <BlockStack spacing="tight">
            <Separator />
            <MoneyLine
              label="Subtotal"
              amount={subTotal}
              loading={!calculatedPurchase}
            />
            <MoneyLine
              label="Shipping"
              amount={shipping}
              loading={!calculatedPurchase}
            />
            <MoneyLine
              label="Taxes"
              amount={taxes}
              loading={!calculatedPurchase}
            />
            <Separator />
            <MoneySummary label="Total" amount={total} />
          </BlockStack>

          <BlockStack>
            <Button onPress={acceptOffer} submit loading={loading}>
              Pay now · {formatCurrency(total)}
            </Button>

            <Button onPress={declineOffer} subdued loading={loading}>
              Decline this offer
            </Button>
          </BlockStack>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}

function MoneySummary({ label, amount }) {
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

function MoneyLine({ label, amount, loading = false }) {
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

function PriceHeader({ discountedPrice, originalPrice, loading, discount }) {
  return (
    <TextContainer alignment="leading" spacing="loose">
      <Text emphasized size="large">
        {" "}
        {!loading && formatCurrency(discount ? discountedPrice : originalPrice)}
      </Text>{" "}
      {discount && (
        <Text role="deletion" size="small">
          {!loading && originalPrice}
        </Text>
      )}{" "}
      {discount && (
        <Text size="medium" appearance="success">
          Save({!loading && discount}%)
        </Text>
      )}
    </TextContainer>
  );
}
