import React from "react";
import ExampleStyle from "./lib/ExampleStyle";
import { LoadingSpinner } from "./lib/LoadingSpinner";
import MetaData from "./lib/MetaData";
import Scripts from "./lib/Scripts";
import Styles from "./lib/Styles";
import SystemJs from "./lib/SystemJs";

/**
 * This is the template for executing React examples in the example runner.
 */
const ReactTemplateLegacy = ({
  isDev,
  isExecuting,
  modifiedTimeMs,
  library,
  boilerplatePath,
  appLocation,
  options,
  scriptFiles,
  styleFiles,
  importType,
  type,
  internalFramework,
}) => (
  <html lang="en">
    <head>
      <MetaData
        title="React example"
        modifiedTimeMs={modifiedTimeMs}
        isExecuting={isExecuting}
        options={options}
        isDev={isDev}
      />
      <ExampleStyle rootId="root" />
      {(type !== "generated" || library !== "grid") && (
        <Styles baseUrl={appLocation} files={styleFiles} />
      )}
    </head>
    <body>
      <div id="root"></div>
      <LoadingSpinner />
      <Scripts baseUrl={appLocation} files={scriptFiles} />
      <SystemJs
        library={library}
        boilerplatePath={boilerplatePath}
        appLocation={appLocation}
        startFile={`${appLocation}/${
          internalFramework === "reactFunctionalTs" ? "index.tsx" : "index.jsx"
        }`}
        framework={"react"}
        importType={importType}
        options={options}
        isDev={false}
      />
    </body>
  </html>
);

export default ReactTemplateLegacy;
