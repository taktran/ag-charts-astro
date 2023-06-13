import { getPageSlug } from "./pages";

describe.each([
  {
    rootFolder: "content/docs",
    url: "content/docs/line-series/index.mdx",
    expected: "line-series",
  },
])("getPageSlug(%i, %i)", ({ url, rootFolder, expected }) => {
  test(`returns ${expected}`, () => {
    expect(
      getPageSlug({
        rootFolder,
        url,
      })
    ).toBe(expected);
  });
});
