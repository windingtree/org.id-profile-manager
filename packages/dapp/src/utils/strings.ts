// Makes shorter text with ellipsis in the center
export const centerEllipsis = (text: string, width = 4): string =>
  text
    ? text.length > ((width * 2) + 3)
      ? `${text.substring(0, width + 2)}...${text.substring(-width, width)}`
      : text
    : '';

// Copies text to clipboard
export const copyToClipboard = (text: string): Promise<void> =>
  navigator
    .clipboard
    .writeText(text)
    .then(resolve => resolve);
