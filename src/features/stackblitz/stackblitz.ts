import sdk from "@stackblitz/sdk";
import { getFrameworkProject } from "./getFrameworkProject";

export function openProject({
  title,
  framework,
  internalFramework,
  entryFileName,
  entryFile,
  isEnterprise,
}) {
  const project = getFrameworkProject({
    title,
    framework,
    internalFramework,
    entryFileName,
    entryFile,
  });

  if (!project) {
    throw new Error(
      `No project files found for ${JSON.stringify({
        title,
        framework,
        internalFramework,
        entryFileName,
        entryFilePath,
      })}`
    );
  }

  sdk.openProject(project);
}
