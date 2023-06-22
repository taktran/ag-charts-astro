import path from "node:path";
import fs from "node:fs/promises";
import { getIsDev } from "../../../utils/pages";

export const getContentRootFileUrl = (): URL => {
  const contentRoot = getIsDev()
    ? // Relative to the folder of this file
      "../../../content"
    : // Relative to `./dist/_astro` folder
      "../../../src/content";
  return new URL(contentRoot, import.meta.url);
};

export const getSourceExamplesPathUrl = ({
  pageName,
}: {
  pageName: string;
}) => {
  const contentRoot = getContentRootFileUrl();
  const examplesFolderPath = path.join("docs", pageName, "_examples");
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

export const getSourceFolderUrl = ({
  pageName,
  exampleName,
}: {
  pageName: string;
  exampleName: string;
}) => {
  const examplesFolderPath = getSourceExamplesPathUrl({
    pageName,
  }).pathname;
  const exampleFolderPath = path.join(examplesFolderPath, exampleName);

  return new URL(exampleFolderPath, import.meta.url);
};

export const getSourceFileUrl = ({
  pageName,
  exampleName,
  fileName,
}: {
  pageName: string;
  exampleName: string;
  fileName: string;
}) => {
  const exampleFolderPath = getSourceFolderUrl({
    pageName,
    exampleName,
  }).pathname;
  const entryFilePath = path.join(exampleFolderPath, fileName);

  return new URL(entryFilePath, import.meta.url);
};

export const getSourceFileContents = ({
  pageName,
  exampleName,
  fileName,
}: {
  pageName: string;
  exampleName: string;
  fileName: string;
}): Promise<string | undefined> => {
  const entryFileUrl = getSourceFileUrl({
    pageName,
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

  return entryFileName === "main.js"
    ? entryFile?.includes("agChartsEnterprise")
    : entryFile?.includes("ag-charts-enterprise");
};

export const getContentsOfFileList = async ({
  pageName,
  exampleName,
  fileList,
}: {
  pageName: string;
  exampleName: string;
  fileList: string[];
}) => {
  const contentFiles = {} as Record<string, string>;
  await Promise.all(
    fileList.map(async (fileName) => {
      const file = (await getSourceFileContents({
        pageName,
        exampleName,
        fileName,
      })) as string;
      if (file) {
        contentFiles[fileName] = file;
      }
    })
  );

  return contentFiles;
};