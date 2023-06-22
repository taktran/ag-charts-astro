import { getCollection, getEntry } from "astro:content";
import { getIsDev, getDocExampleFiles } from "../../../../../utils/pages";
import { getContentRootFileUrl } from "../../../../../features/examples-generator/utils/fileUtils";
import { getGeneratedContents } from "../../../../../features/examples-generator/examplesGenerator";

export async function getStaticPaths() {
  const pages = await getCollection("docs");
  const examples = await getDocExampleFiles({
    pages,
  });
  return examples;
}

export async function get({ params, request }) {
  const { internalFramework, pageName, exampleName, fileName } = params;

  const importType = "packages"; // TODO: Only valid for charts

  const contentRoot = getContentRootFileUrl();
  if (internalFramework === "vanilla") {
    const { files } = await getGeneratedContents({
      internalFramework,
      importType,
      pageName,
      exampleName,
    });
    const entryFile = files[fileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? `File not found within: ${contentRoot.pathname}`
        : "Not found",
    };
  } else if (internalFramework === "react") {
    const { files } = await getGeneratedContents({
      internalFramework,
      importType,
      pageName,
      exampleName,
    });

    const entryFile = files[fileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? `File not found within: ${contentRoot.pathname}`
        : "Not found",
    };
  } else {
    const pageEntry = await getEntry("docs", pageName);
    const debugOutput = JSON.stringify(
      {
        contentRoot: contentRoot.pathname,
        internalFramework,
        pageName,
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
