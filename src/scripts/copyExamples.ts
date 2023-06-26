import "dotenv/config";
import fsOriginal from "node:fs";
import path from "node:path";
import url from "node:url";
import dashdash from "dashdash";
import {
  getFilesRecursively,
  getFoldersRecursively,
} from "../features/examples-generator/utils/fileUtils";

// Specify the options. Minimally `name` (or `names`) and `type`
// must be given for each.
const options = [
  {
    names: ["skipCopy"],
    type: "bool",
    help: "Skip copying files",
  },
];
const opts = dashdash.parse({ options: options });

const fs = fsOriginal.promises;
const DIR_NAME = path.dirname(url.fileURLToPath(import.meta.url));

const DOC_PAGES_FOLDER = "grid-packages/ag-grid-docs/documentation/doc-pages";

const ROOT_FOLDER = path.join(DIR_NAME, "../../");
const CONTENTS_PATH = "src/content/docs";
const CONTENTS_FOLDER = path.join(ROOT_FOLDER, CONTENTS_PATH);

async function copyDocPages({
  srcFolder,
  destFolder,
  filterFiles,
}: {
  srcFolder: string;
  destFolder: string;
  filterFiles?: (file: string) => boolean;
}) {
  const numDocPageFolders = (await fs.readdir(srcFolder)).length;
  console.log(
    `Moving doc pages (${numDocPageFolders}) from '${srcFolder}' to '${destFolder}'`
  );
  return fs.cp(srcFolder, destFolder, {
    recursive: true,
    filter: filterFiles,
  });
}

async function renameMarkdownFiles({ rootFolder }: { rootFolder: string }) {
  const contentFiles = await getFilesRecursively(rootFolder);
  const markdownFiles = contentFiles.filter((file) => {
    return file.endsWith(".md");
  });

  console.log(`Renaming (${markdownFiles.length}) '.md' files to '.mdx'`);

  const regex = /(.*)(\.md)$/gm;
  const replacement = `$1.mdx`;

  return Promise.all(
    markdownFiles.map((file) => {
      const newFile = file.replace(regex, replacement);
      return fs.rename(file, newFile);
    })
  );
}

async function updateMarkdownFiles({ rootFolder }: { rootFolder: string }) {
  const contentFiles = await getFilesRecursively(rootFolder);
  const markdownFiles = contentFiles.filter((file) => {
    return file.endsWith(".mdx");
  });

  {
    console.log(
      `Replacing (${markdownFiles.length}) '<grid-example>' to '<GridExampleRunner>'`
    );
    const gridRegex = /(\<)(grid-example)(.*)(grid-example)(\>)/gm;
    const gridReplacement = `$1GridExampleRunner$3GridExampleRunner$5`;
    const results = await Promise.all(
      markdownFiles.map(async (file) => {
        const contents = (await fs.readFile(file)).toString();
        const hasGridExampleRunner = gridRegex.exec(contents) !== null;

        if (!hasGridExampleRunner) {
          return false;
        }

        const newContents = contents.replace(gridRegex, gridReplacement);
        await fs.writeFile(file, newContents);

        return true;
      })
    );
    const numGridReplacements = results.filter(Boolean).length;

    console.log(`Replaced ${numGridReplacements} files`);
  }

  {
    console.log(
      `Replacing (${markdownFiles.length}) '<chart-example>' to '<ChartExampleRunner>'`
    );
    const chartRegex = /(\<)(chart-example)(.*)(chart-example)(\>)/gm;
    const chartReplacement = `$1ChartExampleRunner$3ChartExampleRunner$5`;
    const results = await Promise.all(
      markdownFiles.map(async (file) => {
        const contents = (await fs.readFile(file)).toString();
        const hasChartExampleRunner = chartRegex.exec(contents) !== null;

        if (!hasChartExampleRunner) {
          return false;
        }

        const newContents = contents.replace(chartRegex, chartReplacement);
        await fs.writeFile(file, newContents);

        return true;
      })
    );
    const numChartReplacements = results.filter(Boolean).length;

    console.log(`Replaced ${numChartReplacements} files`);
  }
}

async function renameExamplesFolder({ rootFolder }: { rootFolder: string }) {
  const contentFolders = await getFoldersRecursively({ dir: rootFolder });
  const examplesFolders = contentFolders.filter((folder) => {
    return folder.endsWith("examples");
  });

  console.log(
    `Renaming (${examplesFolders.length}) 'examples' folders to '_examples'`
  );

  const regex = /(.*)\/examples$/gm;
  const replacement = `$1/_examples`;

  return Promise.all(
    examplesFolders.map((folder) => {
      const newFolder = folder.replace(regex, replacement);
      return fs.rename(folder, newFolder);
    })
  );
}

async function renameResourcesFolder({ rootFolder }: { rootFolder: string }) {
  const contentFolders = await getFoldersRecursively({ dir: rootFolder });
  const resourcesFolders = contentFolders.filter((folder) => {
    return folder.endsWith("resources");
  });

  console.log(
    `Renaming (${resourcesFolders.length}) 'resources' folders to '_resources'`
  );

  const regex = /(.*)\/resources$/gm;
  const replacement = `$1/_resources`;

  return Promise.all(
    resourcesFolders.map((folder) => {
      const newFolder = folder.replace(regex, replacement);
      return fs.rename(folder, newFolder);
    })
  );
}

async function copyJsonFilesIntoResourcesFolder({
  rootFolder,
}: {
  rootFolder: string;
}) {
  const contentFiles = await getFilesRecursively(rootFolder);
  const isDocsPageFolder = (file: string) => {
    const folders = file.split("/");
    // Looking for `src/content/docs/[page]/*`
    // ie,          -5 /  -4   / -3 /  -2  / -1
    return (
      folders[folders.length - 3] === "docs" &&
      folders[folders.length - 4] === "content" &&
      folders[folders.length - 5] === "src"
    );
  };
  const jsonFiles = contentFiles.filter((file) => {
    return file.endsWith(".json") && isDocsPageFolder(file);
  });

  console.log(
    `Moving (${jsonFiles.length}) '.json' files to '_resources' folder`
  );

  return Promise.all(
    jsonFiles.map(async (file) => {
      const folders = file.split("/");
      const fileName = folders[folders.length - 1];
      // Replace file with `_resources` folder
      folders[folders.length - 1] = "_resources";

      const resourcesFolder = path.join("/", ...folders);
      if (!fsOriginal.existsSync(resourcesFolder)) {
        try {
          await fs.mkdir(resourcesFolder);
        } catch (e) {
          // Ignore, in case it's already created
        }
      }

      const newFilePath = path.join(resourcesFolder, fileName);
      return fs.rename(file, newFilePath);
    })
  );
}

async function runTask(label: string, fn: () => Promise<void | any>) {
  console.time(label);
  await fn();
  console.timeEnd(label);
  console.log();
}

/**
 * Copy examples from AG Grid local folder to astro content folder
 */
async function copyExamples({ skipCopy }: { skipCopy: boolean }) {
  if (!skipCopy) {
    const agGridRootPath = process.env.AG_GRID_ROOT_PATH;

    if (!agGridRootPath) {
      throw new Error("No AG_GRID_ROOT_PATH specified in .env");
    }

    await runTask("Copy doc pages", () =>
      copyDocPages({
        srcFolder: path.join(agGridRootPath, DOC_PAGES_FOLDER),
        destFolder: CONTENTS_FOLDER,
        filterFiles: (file: string) => {
          if (file.includes("_gen")) {
            return false;
          }

          return true;
        },
      })
    );
  }

  await runTask("Rename markdown files", () =>
    renameMarkdownFiles({
      rootFolder: CONTENTS_FOLDER,
    })
  );

  await runTask("Update markdown files", () =>
    updateMarkdownFiles({
      rootFolder: CONTENTS_FOLDER,
    })
  );

  await runTask("Rename examples folder", () =>
    renameExamplesFolder({
      rootFolder: CONTENTS_FOLDER,
    })
  );

  await runTask("Rename resources folder", () =>
    renameResourcesFolder({
      rootFolder: CONTENTS_FOLDER,
    })
  );

  await runTask("Copy JSON files to resources folder", () =>
    copyJsonFilesIntoResourcesFolder({
      rootFolder: CONTENTS_FOLDER,
    })
  );
}

runTask("Copy examples total", () => copyExamples(opts as any));
