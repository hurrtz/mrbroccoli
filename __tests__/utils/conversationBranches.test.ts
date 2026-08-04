import {
  buildConversationBranchRows,
  getConversationBranchesByMessageId,
} from "../../src/utils/conversationBranches";
import type { ConversationMeta } from "../../src/types";

function meta(
  id: string,
  branch?: ConversationMeta["branch"],
): ConversationMeta {
  return {
    id,
    title: id,
    createdAt: `2026-08-04T10:00:0${id.length}.000Z`,
    updatedAt: `2026-08-04T10:00:0${id.length}.000Z`,
    messageCount: 2,
    providers: [],
    providerModels: {},
    lastModel: null,
    lastProvider: null,
    pinned: false,
    branch,
  };
}

function branch(
  rootConversationId: string,
  parentConversationId: string,
  parentMessageId: string,
): NonNullable<ConversationMeta["branch"]> {
  return {
    rootConversationId,
    parentConversationId,
    parentMessageId,
    branchMessageId: `${parentMessageId}-copy`,
    kind: "continue-from-message",
    createdAt: "2026-08-04T10:00:00.000Z",
  };
}

describe("conversation branch graph", () => {
  it("groups recursive branches under their parents in graph order", () => {
    const root = meta("root");
    const first = meta("first", branch("root", "root", "root-message"));
    const sibling = meta("sibling", branch("root", "root", "root-message"));
    const nested = meta("nested", branch("root", "first", "first-message"));

    const rows = buildConversationBranchRows([sibling, nested, first, root]);

    expect(
      rows.map(({ conversation, depth }) => [conversation.id, depth]),
    ).toEqual([
      ["root", 0],
      ["sibling", 1],
      ["first", 1],
      ["nested", 2],
    ]);
    expect(rows[0].hasChildren).toBe(true);
    expect(rows[2].hasChildren).toBe(true);
  });

  it("keeps an orphaned branch usable as a graph root", () => {
    const orphan = meta(
      "orphan",
      branch("deleted-root", "deleted-parent", "deleted-message"),
    );

    expect(buildConversationBranchRows([orphan])).toEqual([
      expect.objectContaining({ conversation: orphan, depth: 0 }),
    ]);
  });

  it("omits every descendant of a collapsed conversation", () => {
    const root = meta("root");
    const child = meta("child", branch("root", "root", "root-message"));
    const nested = meta("nested", branch("root", "child", "child-message"));

    const rows = buildConversationBranchRows([nested, child, root], new Set());

    expect(rows.map(({ conversation }) => conversation.id)).toEqual(["root"]);
    expect(rows[0]).toEqual(
      expect.objectContaining({ hasChildren: true, isExpanded: false }),
    );
  });

  it("maps every direct child to its exact parent checkpoint", () => {
    const first = meta("first", branch("root", "root", "message-1"));
    const second = meta("second", branch("root", "root", "message-1"));
    const other = meta("other", branch("root", "root", "message-2"));

    const branches = getConversationBranchesByMessageId(
      [first, second, other],
      "root",
    );

    expect(branches.get("message-1")?.map(({ id }) => id)).toEqual([
      "first",
      "second",
    ]);
    expect(branches.get("message-2")?.map(({ id }) => id)).toEqual(["other"]);
  });
});
