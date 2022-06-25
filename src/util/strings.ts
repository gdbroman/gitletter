export const getWordCount = (str: string) => {
  const arr = str.split(" ");

  return arr.filter((word) => word !== "").length;
};

export const stringDateToReadableDate = (str: string) => {
  const date = new Date(str);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
