import { formatBytes } from "../../src/utils/formatBytes";

describe("formatBytes", () => {
  it("reports a zero-byte model download as zero", () => {
    expect(formatBytes(0)).toBe("0 MB");
  });

  it("formats megabyte and gigabyte model sizes", () => {
    expect(formatBytes(31 * 1024 ** 2)).toBe("31 MB");
    expect(formatBytes(1.5 * 1024 ** 3)).toBe("1.5 GB");
  });
});
