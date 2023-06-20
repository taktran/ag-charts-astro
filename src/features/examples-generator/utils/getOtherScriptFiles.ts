import { readAsJsFile } from "../transformation-scripts/parser-utils";
import { getContentsOfFileList } from "./file-utils";

export type FileContents = Record<string, string>;

const getOtherTsGeneratedFiles = async ({
  sourceEntryFileName,
  sourceFileList,
  page,
  exampleName,
}: {
  sourceEntryFileName: string;
  sourceFileList: string[];
  page: string;
  exampleName: string;
}) => {
  const otherTsFiles = sourceFileList
    .filter((fileName) => fileName.endsWith(".ts"))
    // Exclude entry file
    .filter((fileName) => fileName !== sourceEntryFileName);
  const tsFileContents = await getContentsOfFileList({
    page,
    exampleName,
    fileList: otherTsFiles,
  });

  const generatedFiles = {} as FileContents;
  Object.keys(tsFileContents).forEach((tsFileName) => {
    const srcFile = tsFileContents[tsFileName];
    const jsFileName = tsFileName.replace(".ts", ".js");
    generatedFiles[jsFileName] = readAsJsFile(srcFile);
  });

  return generatedFiles;
};

const getOtherJsFiles = ({
  sourceFileList,
  page,
  exampleName,
}: {
  sourceFileList: string[];
  page: string;
  exampleName: string;
}): Promise<FileContents> => {
  const otherJsFiles = sourceFileList.filter((fileName) =>
    fileName.endsWith(".js")
  );
  return getContentsOfFileList({
    page,
    exampleName,
    fileList: otherJsFiles,
  });
};

export const getOtherScriptFiles = async ({
  sourceEntryFileName,
  sourceFileList,
  page,
  exampleName,
}: {
  sourceEntryFileName: string;
  sourceFileList: string[];
  page: string;
  exampleName: string;
}) => {
  const otherTsGeneratedFileContents = await getOtherTsGeneratedFiles({
    sourceEntryFileName,
    sourceFileList,
    page,
    exampleName,
  });
  const otherJsFileContents = await getOtherJsFiles({
    page,
    exampleName,
    sourceFileList,
  });

  const fileNames = Object.keys(otherJsFileContents).concat(
    Object.keys(otherTsGeneratedFileContents)
  );

  const contents = Object.assign(
    {},
    otherTsGeneratedFileContents,
    otherJsFileContents
  ) as FileContents;

  return {
    fileNames,
    contents,
  };
};
