import { FRAMEWORK_SLUGS, INTERNAL_FRAMEWORK_SLUGS } from "../constants";
import fs from "node:fs/promises";
import path from "node:path";
import {
  getEntryFileName,
  getFrameworkFromInternalFramework,
  getSourceExamplesPathUrl,
} from "../features/examples-generator/file-utils";
import { getGeneratedContentsFileList } from "../features/examples-generator/examples-generator";

interface ExamplePathArgs {
  page: string;
  exampleName: string;
  importType: string;
  internalFramework: string;
}

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
          page: page.slug,
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
              page: page.slug,
            });

            const exampleFiles = await fs.readdir(sourceExamplesPathUrl);
            return exampleFiles.map((exampleName) => {
              return {
                params: {
                  internalFramework,
                  page: page.slug,
                  exampleName,
                },
                props: {
                  sourceExamplesPath: sourceExamplesPathUrl.pathname,
                },
              };
            });
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
        const framework = getFrameworkFromInternalFramework(internalFramework);
        return Promise.all(
          pages.map(async (page: any) => {
            const pageExampleFolderPath = getSourceExamplesPathUrl({
              page: page.slug,
            });
            const examples = await fs.readdir(pageExampleFolderPath);
            return examples.map((exampleName) => {
              // Get all example files for the example
              const exampleFileList = getGeneratedContentsFileList({
                internalFramework,
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
                    page: page.slug,
                    exampleName,
                    fileName,
                  },
                  props: {
                    basePath: pageExampleFolderPath,
                    url,
                  },
                };
              });
            });
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
  page,
  exampleName,
}: {
  internalFramework: string;
  page: string;
  exampleName: string;
}) => {
  return path.join("/", internalFramework, page, "examples", exampleName);
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
