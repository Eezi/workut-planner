const DEFAULT_SLICE = 50;

export const sliceLongText = (text: string, sliceNumber = DEFAULT_SLICE): string => {
  if (!text) return '';

  const slicedText = text?.slice(0, sliceNumber)

  if (text.length < sliceNumber) return text;

  return `${slicedText}...`;
};
