import React from "react";
import path from "node:path";

const Scripts = ({ baseUrl, files }) =>
  files.map((file) => {
    const srcFile = path.join(baseUrl, file);
    return <script key={file} src={srcFile} />;
  });

export default Scripts;
