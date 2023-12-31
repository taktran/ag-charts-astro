import React from "react";
import path from "node:path";

const Styles = ({ baseUrl, files = [] }) =>
  files.map((file) => {
    const srcFile = path.join(baseUrl, file);
    return <link key={file} rel="stylesheet" href={srcFile} />;
  });

export default Styles;
