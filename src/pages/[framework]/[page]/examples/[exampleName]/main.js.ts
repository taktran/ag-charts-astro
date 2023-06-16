import { getCollection, getEntry } from "astro:content";
import {
  getDocExamplePages,
  getContentRootFileUrl,
  getEntryFileContents,
  getEntryFileSourceContents,
} from "../../../../../utils/pages";

export async function getStaticPaths() {
  const pages = await getCollection("docs");
  const examples = await getDocExamplePages({
    pages,
  });
  return examples;
}

export async function get({ params, request }) {
  const { framework, page, exampleName } = params;

  const importType = "packages"; // TODO

  const contentRoot = getContentRootFileUrl();
  if (framework === "javascript") {
    const entryFile = await getEntryFileSourceContents({
      page,
      exampleName,
      fileName: "main.ts",
    });
    return {
      body: entryFile ? entryFile : contentRoot.pathname,
    };
  } else if (framework === "react") {
    const entryFile = await getEntryFileSourceContents({
      page,
      exampleName,
      fileName: "main.ts",
    });
    return {
      body: entryFile ? entryFile : contentRoot.pathname,
    };
  } else {
    // For debugging

    const pageEntry = await getEntry("docs", page);

    return {
      body: JSON.stringify({
        contentRoot: contentRoot.pathname,
        framework,
        page,
        exampleName,
        pageEntry,
      }),
    };
  }
}
