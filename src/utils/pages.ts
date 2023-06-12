export function getPageSlug(url: string) {
  const page = url.split("/").pop();
  const slug = page?.split(".")[0];

  return slug;
}
