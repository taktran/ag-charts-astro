import { getContentsOfFileList } from "./file-utils";

export const getStyleFiles = async ({
  sourceFileList,
  page,
  exampleName,
}: {
  sourceFileList: string[];
  page: string;
  exampleName: string;
}) => {
  const styleFiles = sourceFileList.filter((fileName) =>
    fileName.endsWith(".css")
  );

  const styleContents = await getContentsOfFileList({
    page,
    exampleName,
    fileList: styleFiles,
  });

  return styleContents;
};
