import { FRAMEWORK_SLUGS } from "../constants";

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

// TODO: Make file filter more generic
export function isScriptFile(file: string) {
  return file.endsWith(".js");
}

export function isStyleFile(file: string) {
  return file.endsWith(".css");
}

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
