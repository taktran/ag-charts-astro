import { FRAMEWORK_SLUGS } from "../constants";

export function getDocPages(pages: any) {
  return FRAMEWORK_SLUGS.map((framework) => {
    return pages.map((page: any) => {
      return {
        params: {
          framework,
          page: page.slug,
        },
        props: {
          page,
        },
      };
    });
  }).flat();
}
