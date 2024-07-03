// Utility function to format numbers
export const formatNumber = (number) => {
    // if (number >= 1000000000) {
    //     return (number / 1000000000).toFixed(0) + 'B';
    // } else
     if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k';
    }
    return number.toString();
};
