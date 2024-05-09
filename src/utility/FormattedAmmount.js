
  // Format the amount in Indian Rupees
  export const formattedAmount = (amount,formateType,currency,style) => {
    // Format the amount in Indian Rupees
    return amount.toLocaleString(formateType, {
      style: style,
      currency: currency,
    });
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
