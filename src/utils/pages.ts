import { FRAMEWORK_SLUGS, INTERNAL_FRAMEWORK_SLUGS } from "../constants";
import fsOriginal from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getContentRootFileUrl,
  getFilePathsRecursively,
  getSourceExamplesPathUrl,
  getSourceFolderUrl,
} from "../features/examples-generator/utils/fileUtils";
import { getGeneratedContentsFileList } from "../features/examples-generator/examplesGenerator";

export const getIsDev = () => import.meta.env.DEV;

// TODO: Figure out published packages
export const isUsingPublishedPackages = () => false;
export const isPreProductionBuild = () => false;
export const isBuildServerBuild = () => false;

// TODO: Figure out how to get proper paths
export const getChartScriptPath = (isEnterprise: boolean) => {
  return isEnterprise
    ? `https://build.ag-grid.com/dev/ag-charts-enterprise/dist/ag-charts-enterprise.min.js`
    : `https://build.ag-grid.com/dev/ag-charts-community/dist/ag-charts-community.min.js`;
};

// TODO: Figure out how to get proper paths
export const getGridScriptPath = (isEnterprise: boolean) => {
  return isEnterprise
    ? `https://build.ag-grid.com/dev/ag-grid-enterprise/dist/ag-grid-enterprise.min.js`
    : `https://build.ag-grid.com/dev/ag-grid-community/dist/ag-grid-community.min.js`;
};

// TODO: Figure out how to get proper paths
export const getChartReactScriptPath = () =>
  "https://build.ag-grid.com/dev/ag-charts-react/lib/agChartsReact.js";

function ignoreUnderscoreFiles(page: any) {
  const pageFolders = page.slug.split("/");
  const pageName = pageFolders[pageFolders.length - 1];
  return pageName && !pageName.startsWith("_");
}

export function getDocPagesList(pages: any) {
  return pages.filter(ignoreUnderscoreFiles);
}

export function getDocPages(pages: any) {
  return FRAMEWORK_SLUGS.map((framework) => {
    return getDocPagesList(pages).map((page: any) => {
      return {
        params: {
          framework,
          pageName: page.slug,
        },
        props: {
          page,
        },
      };
    });
  }).flat();
}

export async function getDocExamplePages({ pages }: { pages: any }) {
  return (
    await Promise.all(
      INTERNAL_FRAMEWORK_SLUGS.map((internalFramework) => {
        return Promise.all(
          pages.map(async (page: any) => {
            const sourceExamplesPathUrl = getSourceExamplesPathUrl({
              pageName: page.slug,
            });

            if (!fsOriginal.existsSync(sourceExamplesPathUrl)) {
              return [];
            }

            const examples = await fs.readdir(sourceExamplesPathUrl);
            return Promise.all(
              examples.map(async (exampleName) => {
                const sourceFolderUrl = getSourceFolderUrl({
                  pageName: page.slug,
                  exampleName,
                });
                const sourceFiles = await fs.readdir(sourceFolderUrl);
                return {
                  params: {
                    internalFramework,
                    pageName: page.slug,
                    exampleName,
                  },
                  props: {
                    sourceExamplesPath: sourceExamplesPathUrl.pathname,
                    sourceFiles,
                  },
                };
              })
            );
          })
        );
      })
    )
  ).flat(2);
}

export async function getDocExampleFiles({ pages }: { pages: any }) {
  return (
    await Promise.all(
      INTERNAL_FRAMEWORK_SLUGS.map((internalFramework) => {
        return Promise.all(
          pages.map(async (page: any) => {
            const pageExampleFolderPath = getSourceExamplesPathUrl({
              pageName: page.slug,
            });

            if (!fsOriginal.existsSync(pageExampleFolderPath)) {
              return [];
            }

            const examples = await fs.readdir(pageExampleFolderPath);
            return Promise.all(
              examples.map(async (exampleName) => {
                // Get all example files for the example
                const exampleFileList = await getGeneratedContentsFileList({
                  internalFramework,
                  pageName: page.slug,
                  exampleName,
                });

                return exampleFileList.map((fileName) => {
                  const url = path.join(
                    "/",
                    internalFramework,
                    page.slug,
                    "examples",
                    exampleName,
                    fileName
                  );

                  return {
                    params: {
                      internalFramework,
                      pageName: page.slug,
                      exampleName,
                      fileName,
                    },
                    props: {
                      basePath: pageExampleFolderPath,
                      url,
                    },
                  };
                });
              })
            );
          })
        );
      })
    )
  ).flat(3);
}

export async function getDocExampleFilesFromFilePaths({
  pages,
}: {
  pages: any;
}) {
  const contentRoot = getContentRootFileUrl();
  const docsFolder = path.join(contentRoot.pathname, "docs");
  // NOTE: Get all file paths, so that we don't call too many filesystem functions at the same time
  const allFilePaths = await getFilePathsRecursively(docsFolder);

  return (
    await Promise.all(
      INTERNAL_FRAMEWORK_SLUGS.map((internalFramework) => {
        return Promise.all(
          pages.map(async (page: any) => {
            const pageExampleFolderPath = getSourceExamplesPathUrl({
              pageName: page.slug,
            });

            if (!fsOriginal.existsSync(pageExampleFolderPath)) {
              return [];
            }

            const numDocsFolders = docsFolder.split("/").length;
            const examples = allFilePaths
              .filter((filePath) => {
                const folders = filePath.split("/");

                // docs/[pageName]/_examples/[exampleName]
                //  0  /    1     /     2   /    3
                const numFoldersForExamples = numDocsFolders + 3;

                const matchingFolder = path.join(
                  "content",
                  "docs",
                  page.slug,
                  "_examples"
                );

                return (
                  folders.length === numFoldersForExamples &&
                  filePath.includes(matchingFolder)
                );
              })
              .map((filePath) => {
                const folders = filePath.split("/");
                return folders[folders.length - 1];
              });

            return Promise.all(
              examples.map(async (exampleName) => {
                // Get all example files for the example
                const exampleFileList = await getGeneratedContentsFileList({
                  internalFramework,
                  pageName: page.slug,
                  exampleName,
                });

                return exampleFileList.map((fileName) => {
                  const url = path.join(
                    "/",
                    internalFramework,
                    page.slug,
                    "examples",
                    exampleName,
                    fileName
                  );

                  return {
                    params: {
                      internalFramework,
                      pageName: page.slug,
                      exampleName,
                      fileName,
                    },
                    props: {
                      basePath: pageExampleFolderPath,
                      url,
                    },
                  };
                });
              })
            );
          })
        );
      })
    )
  ).flat(3);
}

/**
 * Dynamic path where example files are
 */
export const getExampleLocation = ({
  internalFramework,
  pageName,
  exampleName,
}: {
  internalFramework: string;
  pageName: string;
  exampleName: string;
}) => {
  return path.join("/", internalFramework, pageName, "examples", exampleName);
};

/**
 * The "internalFramework" is the framework name we use inside the example runner depending on which options the
 * user has selected. It can be one of the following:
 *
 * - 'vanilla' (JavaScript)
 * - 'react' (React Classes)
 * - 'reactFunctional' (React Hooks)
 * - 'angular' (Angular)
 * - 'vue' (Vue)
 * - 'vue3' (Vue 3)
 */
export const getInternalFramework = ({
  framework,
  useFunctionalReact,
  useVue3,
  useTypescript,
}: {
  framework: string;
  useFunctionalReact?: boolean;
  useVue3?: boolean;
  useTypescript?: boolean;
}) => {
  switch (framework) {
    case "vue":
      return useVue3 ? "vue3" : "vue";
    case "javascript":
      return useTypescript ? "typescript" : "vanilla";
    case "react":
      return useFunctionalReact
        ? useTypescript
          ? "reactFunctionalTs"
          : "reactFunctional"
        : "react";
    default:
      return framework;
  }
};

export function getBoilerPlateFramework({
  framework,
  useVue3,
  useTypescript,
  internalFramework,
}: {
  framework: string;
  useVue3: boolean;
  useTypescript: boolean;
  internalFramework: string;
}) {
  let boilerPlateFramework;
  switch (framework) {
    // case "vue":
    //   boilerPlateFramework = useVue3 ? "vue3" : "vue";
    //   break;
    case "javascript":
      boilerPlateFramework = useTypescript ? "typescript" : "javascript";
      break;
    case "react":
      boilerPlateFramework =
        useTypescript && internalFramework === "reactFunctionalTs"
          ? "react-ts"
          : "react";
      break;
    // HACK: Use react by default
    // default:
    //   boilerPlateFramework = framework;
    default:
      boilerPlateFramework = "react";
      break;
  }

  return boilerPlateFramework;
}
