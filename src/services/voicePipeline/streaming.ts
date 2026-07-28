export function extractCompleteParagraphs(text: string): {
  completeParagraphs: string[];
  remainder: string;
} {
  if (!text) {
    return {
      completeParagraphs: [],
      remainder: "",
    };
  }

  const completeParagraphs: string[] = [];
  const paragraphBoundary = /\r?\n[ \t]*\r?\n+/g;
  let remainderStart = 0;
  let match: RegExpExecArray | null = null;

  while ((match = paragraphBoundary.exec(text)) !== null) {
    const paragraph = text.slice(remainderStart, match.index).trim();

    if (paragraph) {
      completeParagraphs.push(paragraph);
    }
    remainderStart = match.index + match[0].length;
  }

  return {
    completeParagraphs,
    remainder: text.slice(remainderStart),
  };
}
