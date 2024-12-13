export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function formatCurrency(amount) {
  if (!amount || parseInt(amount, 10) === 0) {
    return "Free";
  }
  return `$${amount}`;
}

export function parsedOptions(options) {
  const parsedOptions = options.map((option) => {
    return {
      value: option.variantID,
      label: option.title,
    };
  });

  return parsedOptions;
}

export function getSelectedVariant(variants, variantID) {
  return variants.filter((variant) => variant.variantID === variantID);
}
