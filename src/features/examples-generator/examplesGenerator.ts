import {
  getEntryFileName,
  getSourceFileContents,
  getFrameworkFromInternalFramework,
  getIsEnterprise,
  getSourceFolderUrl,
} from "./utils/fileUtils";
import chartVanillaSrcParser from "./transformation-scripts/chart-vanilla-src-parser";
import { vanillaToReact } from "./transformation-scripts/chart-vanilla-to-react";
import { readAsJsFile } from "./transformation-scripts/parser-utils";
import fs from "node:fs/promises";
import {
  getOtherScriptFiles,
  type FileContents,
} from "./utils/getOtherScriptFiles";
import { getStyleFiles } from "./utils/getStyleFiles";
interface GeneratedContents {
  files: FileContents;
  entryFileName: string;
  scriptFiles: string[];
  styleFiles: string[];
  isEnterprise: boolean;
  sourceFileList: string[];
}

function deepCloneObject(object: object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Get the file list of the generated contents
 * (without generating the contents)
 */
export const getGeneratedContentsFileList = async ({
  internalFramework,

  // TODO: file list can be different if there are extra files
  // importType,
  pageName,
  exampleName,
}): string[] => {
  const framework = getFrameworkFromInternalFramework(internalFramework);
  const entryFileName = getEntryFileName({ framework, internalFramework });
  const sourceFolderUrl = getSourceFolderUrl({
    pageName,
    exampleName,
  });
  const sourceFileList = await fs.readdir(sourceFolderUrl);
  const scriptFiles = await getOtherScriptFiles({
    sourceEntryFileName: entryFileName,
    sourceFileList,
    pageName,
    exampleName,
  });
  const styleFiles = await getStyleFiles({
    sourceFileList,
    pageName,
    exampleName,
  });

  let generatedFileList = Object.keys(scriptFiles).concat(
    Object.keys(styleFiles)
  );
  if (internalFramework === "vanilla") {
    generatedFileList = generatedFileList.concat(["index.html"]);
  } else if (internalFramework === "react") {
    generatedFileList = generatedFileList.concat("index.jsx");
  } else {
    // HACK: Use react for the rest of the other frameworks for now
    generatedFileList = generatedFileList.concat("index.jsx");
  }

  return generatedFileList;
};

/**
 * Get generated contents for an example
 */
export const getGeneratedContents = async ({
  internalFramework,
  importType,
  pageName,
  exampleName,
}): Promise<GeneratedContents | undefined> => {
  const framework = getFrameworkFromInternalFramework(internalFramework);
  const sourceFolderUrl = getSourceFolderUrl({
    pageName,
    exampleName,
  });
  const sourceFileList = await fs.readdir(sourceFolderUrl);

  const entryFileName = getEntryFileName({ framework, internalFramework });
  const sourceEntryFileName = "main.ts";
  const entryFile = await getSourceFileContents({
    pageName,
    exampleName,
    fileName: sourceEntryFileName,
  });
  const indexHtml = (await getSourceFileContents({
    pageName,
    exampleName,
    fileName: "index.html",
  })) as string;

  if (!entryFile) {
    return;
  }

  const { bindings, typedBindings } = chartVanillaSrcParser({
    srcFile: entryFile,
    html: indexHtml,
    exampleSettings: {},
  });

  const isEnterprise = getIsEnterprise({
    framework,
    internalFramework,
    entryFile,
  });

  const otherScriptFiles = await getOtherScriptFiles({
    sourceEntryFileName,
    sourceFileList,
    pageName,
    exampleName,
  });
  const styleFiles = await getStyleFiles({
    sourceFileList,
    pageName,
    exampleName,
  });

  const contents: GeneratedContents = {
    isEnterprise,
    scriptFiles: Object.keys(otherScriptFiles),
    styleFiles: Object.keys(styleFiles),
    sourceFileList,
    files: Object.assign(otherScriptFiles, styleFiles),
  } as GeneratedContents;
  if (internalFramework === "vanilla") {
    let mainJs = readAsJsFile(entryFile);

    // Chart classes that need scoping
    const chartImports = typedBindings.imports.find(
      (i: any) =>
        i.module.includes("ag-charts-community") ||
        i.module.includes("ag-charts-enterprise")
    );
    if (chartImports) {
      chartImports.imports.forEach((i: any) => {
        const toReplace = `(?<!\\.)${i}([\\s\/.])`;
        const reg = new RegExp(toReplace, "g");
        mainJs = mainJs.replace(
          reg,
          `${isEnterprise ? "agChartsEnterprise" : "agCharts"}.${i}$1`
        );
      });
    }

    contents.files["main.js"] = mainJs;
    contents.files["index.html"] = indexHtml;

    contents.scriptFiles.push("main.js");
    contents.entryFileName = "main.js";
  } else if (internalFramework === "react") {
    const getSource = vanillaToReact(
      deepCloneObject(bindings),
      [] // TODO: extractComponentFileNames(reactScripts, "_react"),
    );
    // TODO:
    // importTypes.forEach((importType) =>
    //   reactConfigs.set(importType, { "index.jsx": getSource(importType) })
    // );

    contents.files[entryFileName] = getSource();

    contents.entryFileName = entryFileName;
  } else {
    // HACK: Use react for the rest of the frameworks
    const getSource = vanillaToReact(
      deepCloneObject(bindings),
      [] // TODO: extractComponentFileNames(reactScripts, "_react"),
    );
    // TODO:
    // importTypes.forEach((importType) =>
    //   reactConfigs.set(importType, { "index.jsx": getSource(importType) })
    // );

    contents.files[entryFileName] = getSource();

    contents.entryFileName = entryFileName;
  }

  return contents;
};
