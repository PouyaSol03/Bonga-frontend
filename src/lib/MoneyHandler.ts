export const formatPrice = (value: number) => {
  if (!value && value !== 0) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatBigNumber = (value: number) => {
  if (!value && value !== 0) return "";
  
  const num = Number(value);
  
  if (num >= 1000000000) {
    const billion = num / 1000000000;
    return `${Number(billion.toFixed(1))} میلیارد`; 
  }
  
  if (num >= 1000000) {
    const million = num / 1000000;
    return `${Number(million.toFixed(1))} میلیون`;
  }
  
  if (num >= 1000) {
    const thousand = num / 1000;
    return `${Number(thousand.toFixed(1))} هزار`;
  }

  return num.toString();
};