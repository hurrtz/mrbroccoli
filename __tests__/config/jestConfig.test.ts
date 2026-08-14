describe("Jest configuration", () => {
  it("excludes browser-only design-sync tooling from the module map", () => {
    const config = require("../../jest.config.js") as {
      modulePathIgnorePatterns?: string[];
    };

    expect(config.modulePathIgnorePatterns).toContain(
      "<rootDir>/.design-sync/",
    );
  });
});
