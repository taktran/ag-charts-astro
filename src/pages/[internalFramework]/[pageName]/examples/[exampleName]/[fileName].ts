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
  const createDevErrorMessage = ({ availableFiles }) =>
    JSON.stringify({
      error: `File not found`,
      contentPath: contentRoot.pathname,
      availableFiles: Object.keys(availableFiles),
    });
  if (internalFramework === "vanilla") {
    const { files } =
      (await getGeneratedContents({
        internalFramework,
        importType,
        pageName,
        exampleName,
      })) || {};
    const entryFile = files && files[fileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? createDevErrorMessage({ availableFiles: files })
        : "Not found",
    };
  } else if (internalFramework === "react") {
    const { files } =
      (await getGeneratedContents({
        internalFramework,
        importType,
        pageName,
        exampleName,
      })) || {};

    const entryFile = files && files[fileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? createDevErrorMessage({ availableFiles: files })
        : "Not found",
    };
  } else {
    // HACK: Use react for the rest of the frameworks
    const { files } =
      (await getGeneratedContents({
        internalFramework,
        importType,
        pageName,
        exampleName,
      })) || {};

    const entryFile = files && files[fileName];
    return {
      body: entryFile
        ? entryFile
        : getIsDev()
        ? createDevErrorMessage({ availableFiles: files })
        : "Not found",
    };

    // Debugging
    // const pageEntry = await getEntry("docs", pageName);
    // const debugOutput = JSON.stringify(
    //   {
    //     contentRoot: contentRoot.pathname,
    //     internalFramework,
    //     pageName,
    //     exampleName,
    //     pageEntry,
    //   },
    //   null,
    //   2
    // );

    // const body = getIsDev() ? `Not found: ${debugOutput}` : "Not found";
    // return {
    //   body,
    // };
  }
}
