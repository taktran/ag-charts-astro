import {
  getEntryFileName,
  getEntryFileSourceContents,
  getFrameworkFromInternalFramework,
} from "./file-utils";
import chartVanillaSrcParser from "./transformation-scripts/chart-vanilla-src-parser";
import { vanillaToReact } from "./transformation-scripts/chart-vanilla-to-react";
import { readAsJsFile } from "./transformation-scripts/parser-utils";

interface GeneratedContents {
  files: Record<string, string>;
  entryFileName: string;
}

function deepCloneObject(object: object) {
  return JSON.parse(JSON.stringify(object));
}

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
  const entryFile = await getEntryFileSourceContents({
    page,
    exampleName,
    fileName: "main.ts",
  });
  const indexHtml = (await getEntryFileSourceContents({
    page,
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

  let contents: GeneratedContents = {} as GeneratedContents;
  if (internalFramework === "vanilla") {
    contents.files = {
      "main.js": readAsJsFile(entryFile),
      "index.html": indexHtml,
    };
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
