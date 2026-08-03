function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line: string) {
  const cells = splitTableRow(line);
  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")))
  );
}

function endSpokenItem(text: string) {
  return /[.!?…。！？:;]$/.test(text) ? text : `${text}.`;
}

function renderMarkdownLine(line: string) {
  const heading = line.match(/^\s{0,3}#{1,6}\s+(.+)$/);
  if (heading) {
    return endSpokenItem(heading[1].trim());
  }
  const bullet = line.match(/^\s*[-+*]\s+(.+)$/);
  if (bullet) {
    return endSpokenItem(bullet[1].trim());
  }
  const ordered = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
  if (ordered) {
    return endSpokenItem(`${ordered[1]}. ${ordered[2].trim()}`);
  }
  return line.replace(/^\s*>+\s?/, "");
}

function renderTableRows(lines: string[]) {
  const rendered: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (
      lines[index].includes("|") &&
      lines[index + 1] &&
      isTableDivider(lines[index + 1])
    ) {
      const headers = splitTableRow(lines[index]);
      index += 2;
      let rowCount = 0;
      while (index < lines.length && lines[index].includes("|")) {
        const cells = splitTableRow(lines[index]);
        const row = cells
          .map((cell, cellIndex) => {
            const header = headers[cellIndex];
            return header && cell ? `${header}: ${cell}` : cell;
          })
          .filter(Boolean)
          .join(". ");
        if (row) {
          rendered.push(endSpokenItem(row));
        }
        rowCount += 1;
        index += 1;
      }
      if (rowCount === 0) {
        rendered.push(endSpokenItem(headers.join(". ")));
      }
      index -= 1;
      continue;
    }

    rendered.push(lines[index]);
  }

  return rendered;
}

/**
 * Produces a speech-only view of a response. The saved and visible transcript
 * remains untouched; this only removes formatting that speech engines tend to
 * pronounce literally and turns Markdown tables into labelled statements.
 */
export function renderTextForSpeech(text: string) {
  const tableRendered = renderTableRows(
    text
      .replace(/\r\n?/g, "\n")
      .replace(/^```[^\n]*$/gm, "")
      .replace(/^~~~[^\n]*$/gm, "")
      .replace(/\[\^[^\]]+\]/g, "")
      .replace(/\[(?:\d+|[a-z])\](?=\s|[.,;:!?)]|$)/gi, "")
      .split("\n"),
  )
    .map(renderMarkdownLine)
    .join("\n");

  return tableRendered
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:)[^)]+\)/g, "$1")
    .replace(/https?:\/\/(?:www\.)?([^\s/]+)(?:\/[^\s]*)?/g, "$1")
    .replace(/(`{1,2}|\*{1,3}|_{1,3}|~~)/g, "")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
