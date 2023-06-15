import { openProject } from "../../utils/stackblitz";
import "./OpenStackblitzButton.module.scss";

interface Props {
  title: string;
  name: string;
  framework: string;
}

export function OpenStackblitzButton({ title, name, framework }) {
  // TODO: Pass in dynamic entry point file based on name and framework
  return (
    <button
      onClick={() => {
        openProject({ title });
      }}
    >
      Open in Stackblitz
    </button>
  );
}
