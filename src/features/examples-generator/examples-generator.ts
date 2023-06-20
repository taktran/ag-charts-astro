import {
  getEntryFileName,
  getSourceFileContents,
  getFrameworkFromInternalFramework,
  getIsEnterprise,
} from "./file-utils";
import chartVanillaSrcParser from "./transformation-scripts/chart-vanilla-src-parser";
import { vanillaToReact } from "./transformation-scripts/chart-vanilla-to-react";
import { readAsJsFile } from "./transformation-scripts/parser-utils";

interface GeneratedContents {
  files: Record<string, string>;
  entryFileName: string;
  scriptFiles: string[];
  styleFiles: string[];
  isEnterprise: boolean;
}

function deepCloneObject(object: object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Get the file list of the generated contents
 * (without generating the contents)
 */
export const getGeneratedContentsFileList = ({
  internalFramework,

  // TODO: file list can be different if there are extra files
  // importType,
  // page,
  // exampleName,
}): string[] => {
  if (internalFramework === "vanilla") {
    return ["main.js", "index.html"];
  } else if (internalFramework === "react") {
    return ["index.jsx"];
  }

  return [];
};

/**
 * Get generated contents for an example
 */
export const getGeneratedContents = async ({
  internalFramework,
  importType,
  page,
  exampleName,
}): Promise<GeneratedContents | undefined> => {
  const framework = getFrameworkFromInternalFramework(internalFramework);
  const entryFileName = getEntryFileName({ framework, internalFramework });
  const entryFile = await getSourceFileContents({
    page,
    exampleName,
    fileName: "main.ts",
  });
  const indexHtml = (await getSourceFileContents({
    page,
    exampleName,
    fileName: "index.html",
  })) as string;

  if (!entryFile) {
    return;
  }

  // Get other script files

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

  let contents: GeneratedContents = {
    isEnterprise,
    scriptFiles: [] as string[], // TODO: Figure out script files
    styleFiles: [] as string[], // TODO: Figure out style files
  } as GeneratedContents;
  if (internalFramework === "vanilla") {
    let mainJs = readAsJsFile(entryFile);

    // Chart classes that need scoping
    const chartImports = typedBindings.imports.find(
      (i) =>
        i.module.includes("ag-charts-community") ||
        i.module.includes("ag-charts-enterprise")
    );
    if (chartImports) {
      chartImports.imports.forEach((i) => {
        const toReplace = `(?<!\\.)${i}([\\s\/.])`;
        const reg = new RegExp(toReplace, "g");
        mainJs = mainJs.replace(
          reg,
          `${isEnterprise ? "agChartsEnterprise" : "agCharts"}.${i}$1`
        );
      });
    }

    contents.files = {
      "main.js": mainJs,
      "index.html": indexHtml,
    };
    contents.scriptFiles = ["main.js"];
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
    contents.files = {
      [entryFileName]: getSource(),
    };
    contents.entryFileName = entryFileName;
  }

  return contents;
};
