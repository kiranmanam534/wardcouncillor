export const isBase64 = (str) => {
    const base64Regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
    return base64Regex.test(str);
  };