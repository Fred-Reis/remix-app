const OFFERS = [
  {
    id: 1,
    title: "One time offer",
    productTitle: "The Collection Snowboard: Oxygen",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0732/6836/3485/files/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1733847607",
    productDescription: ["This PREMIUM snowboard is so SUPER DUPER awesome!"],
    originalPrice: "699.95",
    discountedPrice: "699.95",
    changes: [
      {
        type: "add_variant",
        variantID: 45941438742749,
        quantity: 1,
        discount: {
          value: 50,
          valueType: "percentage",
          title: "50% off",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Monday Morning",
    productTitle: "Monday Morning",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0732/6836/3485/files/MondayMorning_1_800x800_png.png?v=1733913856",
    productDescription: ["Premium rosted coffee!"],
    originalPrice: "20.00",
    discountedPrice: "20.00",
    changes: [
      {
        type: "add_variant",
        variantID: 45943983800541,
        title: "large",
        quantity: 1,
        discount: {
          value: 50,
          valueType: "percentage",
          title: "50% off",
        },
      },
      {
        type: "add_variant",
        variantID: 45943983833309,
        title: "medium",
        quantity: 1,
        discount: {
          value: 50,
          valueType: "percentage",
          title: "50% off",
        },
      },
      {
        type: "add_variant",
        variantID: 45943983866077,
        title: "small",
        quantity: 1,
        discount: {
          value: 50,
          valueType: "percentage",
          title: "50% off",
        },
      },
    ],
  },
];

/*
 * For testing purposes, product information is hardcoded.
 * In a production application, replace this function with logic to determine
 * what product to offer to the customer.
 */
export function getOffers() {
  return OFFERS;
}

/*
 * Retrieve discount information for the specific order on the backend instead of relying
 * on the discount information that is sent from the frontend.
 * This is to ensure that the discount information is not tampered with.
 */
export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}
