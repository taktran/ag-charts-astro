export function getPageSlug({
  rootFolder,
  url,
}: {
  rootFolder: string;
  url: string;
}) {
  const folder = url
    .replace(rootFolder, "")
    .split("/")
    .filter((path) => path !== "")[0];

  return folder;
}
