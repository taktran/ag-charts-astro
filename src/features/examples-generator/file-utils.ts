import path from "node:path";
import fs from "node:fs/promises";
import { getIsDev } from "../../utils/pages";

export const getContentRootFileUrl = (): URL => {
  const contentRoot = getIsDev()
    ? "../../content"
    : // Relative to `./dist/_astro` folder
      "../../../src/content";
  return new URL(contentRoot, import.meta.url);
};

export const getSourceExamplesPathUrl = ({ page }) => {
  const contentRoot = getContentRootFileUrl();
  const examplesFolderPath = path.join("docs", page, "_examples");
  const sourceExamplesPath = path.join(
    contentRoot.pathname,
    examplesFolderPath
  );
  return new URL(sourceExamplesPath, import.meta.url);
};

export const getFrameworkFromInternalFramework = (
  internalFramework: string
) => {
  switch (internalFramework) {
    case "typescript":
    case "vanilla":
      return "javascript";
    case "react":
    case "reactFunctionalTs":
    case "reactFunctional":
      return "react";
    case "vue":
    case "vue3":
      return "vue";
    default:
      return internalFramework;
  }
};

export const getEntryFileName = ({
  framework,
  internalFramework,
}: {
  framework: string;
  internalFramework: string;
}) => {
  const entryFile = {
    react:
      internalFramework === "reactFunctionalTs" ? "index.tsx" : "index.jsx",
    angular: "app/app.component.ts",
    javascript: internalFramework === "typescript" ? "main.ts" : "main.js",
  };

  return entryFile[framework] || "main.js";
};

export const getEntryFileSourcePathUrl = ({ page, exampleName, fileName }) => {
  const examplesFolderPath = getSourceExamplesPathUrl({
    page,
  }).pathname;
  const exampleFolderPath = path.join(examplesFolderPath, exampleName);
  const entryFilePath = path.join(exampleFolderPath, fileName);

  return new URL(entryFilePath, import.meta.url);
};

/**
 * Get entry file source
 */
export const getEntryFileSourceContents = ({
  page,
  exampleName,
  fileName,
}): Promise<string | undefined> => {
  const entryFileUrl = getEntryFileSourcePathUrl({
    page,
    exampleName,
    fileName,
  });
  return fs.readFile(entryFileUrl, "utf-8").catch(() => {
    return undefined;
  });
};
