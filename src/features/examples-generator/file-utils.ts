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

export const getSourceFileUrl = ({ page, exampleName, fileName }) => {
  const examplesFolderPath = getSourceExamplesPathUrl({
    page,
  }).pathname;
  const exampleFolderPath = path.join(examplesFolderPath, exampleName);
  const entryFilePath = path.join(exampleFolderPath, fileName);

  return new URL(entryFilePath, import.meta.url);
};

export const getSourceFileContents = ({
  page,
  exampleName,
  fileName,
}): Promise<string | undefined> => {
  const entryFileUrl = getSourceFileUrl({
    page,
    exampleName,
    fileName,
  });
  return fs.readFile(entryFileUrl, "utf-8").catch(() => {
    return undefined;
  });
};

// TODO: Find a better way to determine if an example is enterprise or not
export const getIsEnterprise = ({
  framework,
  internalFramework,
  entryFile,
}: {
  framework: string;
  internalFramework: string;
  entryFile: string;
}) => {
  const entryFileName = getEntryFileName({ framework, internalFramework });

  const isEnterprise = false;
  return entryFileName === "main.js"
    ? entryFile?.includes("agChartsEnterprise")
    : entryFile?.includes("ag-charts-enterprise");
};
