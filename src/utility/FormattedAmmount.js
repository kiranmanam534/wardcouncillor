// Format the amount in abbreviated form (1k, 2M, etc.) with currency symbol
export const formattedAmount = (amount, formateType, currency, style) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'N/A';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Get currency symbol using toLocaleString
  const currencySymbol = (0)
    .toLocaleString(formateType, {
      style: style,
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();

  // Format based on magnitude
  let formattedValue;
  if (absAmount >= 1000000000) {
    // Billions
    formattedValue =
      (absAmount / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absAmount >= 1000000) {
    // Millions
    formattedValue = (absAmount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absAmount >= 100000) {
    // Lakhs (for Indian format)
    formattedValue = (absAmount / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  } else if (absAmount >= 1000) {
    // Thousands
    formattedValue = (absAmount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    // Less than 1000, use proper locale formatting
    return amount.toLocaleString(formateType, {
      style: style,
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return currencySymbol + ' ' + sign + formattedValue;
};

export const formattedCurrency = (amount, formateType, currency, style) => {
  // Format value as currency
  return new Intl.NumberFormat(formateType, {
    // style: style,
    // currency: currency, // Change currency code as needed
    // currencyDisplay: 'code', // Display currency code instead of symbol
    // currencyDisplay: 'symbol', // Display currency symbol
    minimumFractionDigits: 2,
    useGrouping: false, // Remove grouping separator
  }).format(amount);
};
