export const parseDate = (text: string): Date => {
  return new Date(Date.parse(text));
};
