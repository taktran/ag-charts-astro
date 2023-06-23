export function MenuSidebar({
  pages,
  framework,
}: {
  pages: any;
  framework: string;
}) {
  const urlPrefix = `/${framework}`;

  return (
    <>
      <h2>Pages ({pages.length})</h2>
      <ul>
        {pages.map(({ slug, data }: any) => {
          const url = `${urlPrefix}/${slug}`;
          return (
            <li key={url}>
              <a href={url}>{data.title}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
