import { getCollection, getEntry } from "astro:content";
import {
  getIsDev,
  getDocExampleEntryFiles,
  getContentRootFileUrl,
  getEntryFileSourceContents,
  getGeneratedContents,
} from "../../../../../utils/pages";

export async function getStaticPaths() {
  const pages = await getCollection("docs");
  const examples = await getDocExampleEntryFiles({
    pages,
  });
  return examples;
}

export async function get({ params, request }) {
  const { internalFramework, page, exampleName } = params;

  const importType = "packages"; // TODO: Only valid for charts

  const contentRoot = getContentRootFileUrl();
  if (internalFramework === "vanilla") {
    // TODO: Get generated file
    const entryFileName = "main.ts";
    const entryFile = await getEntryFileSourceContents({
      page,
      exampleName,
      fileName: entryFileName,
    });
    return {
      body: entryFile ? entryFile : contentRoot.pathname,
    };
  } else if (internalFramework === "react") {
    const { files, entryFileName } = await getGeneratedContents({
      internalFramework,
      importType,
      page,
      exampleName,
    });

    const entryFile = files[entryFileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? `File not found within: ${contentRoot.pathname}`
        : "Not found",
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
