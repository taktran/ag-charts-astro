import { openProject } from "../../utils/stackblitz";
import "./OpenStackblitzButton.module.scss";

interface Props {
  title: string;
  entryFileName: string;
  entryFile: string;
  isEnterprise: boolean;
}

export function OpenStackblitzButton({
  title,
  entryFileName,
  entryFile,
  isEnterprise,
}: Props) {
  return (
    <button
      onClick={() => {
        openProject({ title, entryFileName, entryFile, isEnterprise });
      }}
    >
      Open in Stackblitz
    </button>
  );
}
