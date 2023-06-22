import { FRAMEWORK_SLUGS, INTERNAL_FRAMEWORK_SLUGS } from "../constants";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getSourceExamplesPathUrl,
  getSourceFolderUrl,
} from "../features/examples-generator/utils/file-utils";
import { getGeneratedContentsFileList } from "../features/examples-generator/examples-generator";

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
export const getChartReactScriptPath = () =>
  "https://build.ag-grid.com/dev/ag-charts-react/lib/agChartsReact.js";

export function getDocPages(pages: any) {
  return FRAMEWORK_SLUGS.map((framework) => {
    return pages.map((page: any) => {
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
    case "vue":
      boilerPlateFramework = useVue3 ? "vue3" : "vue";
      break;
    case "javascript":
      boilerPlateFramework = useTypescript ? "typescript" : "javascript";
      break;
    case "react":
      boilerPlateFramework =
        useTypescript && internalFramework === "reactFunctionalTs"
          ? "react-ts"
          : "react";
      break;
    default:
      boilerPlateFramework = framework;
  }

  return boilerPlateFramework;
}
