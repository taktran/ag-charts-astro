import { openProject } from "./stackblitz";
import "./OpenStackblitzButton.module.scss";

interface Props {
  title: string;
  framework: string;
  internalFramework: string;
  entryFileName: string;
  entryFile: string;
  isEnterprise: boolean;
}

export function OpenStackblitzButton({
  title,
  framework,
  internalFramework,
  entryFileName,
  entryFile,
  isEnterprise,
}: Props) {
  return (
    <button
      onClick={() => {
        openProject({
          title,
          framework,
          internalFramework,
          entryFileName,
          entryFile,
          isEnterprise,
        });
      }}
    >
      Open in Stackblitz
    </button>
  );
}
