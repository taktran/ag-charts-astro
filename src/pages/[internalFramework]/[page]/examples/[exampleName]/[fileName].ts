import { getCollection, getEntry } from "astro:content";
import {
  getIsDev,
  getDocExampleEntryFiles,
  getContentRootFileUrl,
  getEntryFileContents,
  getEntryFileSourceContents,
} from "../../../../../utils/pages";

export async function getStaticPaths() {
  const pages = await getCollection("docs");
  const examples = await getDocExampleEntryFiles({
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
    const pageEntry = await getEntry("docs", page);
    const debugOutput = JSON.stringify(
      {
        contentRoot: contentRoot.pathname,
        internalFramework,
        page,
        exampleName,
        pageEntry,
      },
      null,
      2
    );

    const body = getIsDev() ? `Not found: ${debugOutput}` : "Not found";
    return {
      body,
    };
  }
}
