/**
 * React Typescript files based on `react-ts` stackblitz template
 */
const getReactTsFiles = ({ title, entryFileName, entryFile }) => {
  const entryFilePath = `src/${entryFileName}`;
  const packageJson = `{
    "name": "ag-charts-react-ts-example",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "build:only": "vite build",
      "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "ag-charts-community": "^8.0.0",
      "ag-charts-react": "^8.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.11",
      "@types/react-dom": "^18.2.4",
      "@typescript-eslint/eslint-plugin": "^5.59.9",
      "@typescript-eslint/parser": "^5.59.9",
      "@vitejs/plugin-react": "^4.0.0",
      "eslint": "^8.42.0",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-react-refresh": "^0.4.1",
      "typescript": "^5.0.2",
      "vite": "^4.3.9"
    }
  }`;
  const styleCss = `
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
  
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  
  #root {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }`;

  const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/${entryFilePath}"></script>
    </body>
  </html>`;

  const viteConfig = `
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  
  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
  })`;

  return {
    "package.json": packageJson,
    [entryFilePath]: entryFile,
    "src/style.css": styleCss,
    "index.html": indexHtml,
    "vite.config.ts": viteConfig,
  };
};

/**
 * Vanilla files based on `javascript` stackblitz template
 */
const getVanillaFiles = ({ title, entryFileName, entryFile }) => {
  const packageJson = `{
    "name": "ag-charts-javascript-example",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "devDependencies": {
      "vite": "^4.3.9"
    }
  }`;
  const styleCss = `
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
  
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  
  #myChart {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }`;

  const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/ag-charts-community/dist/ag-charts-community.min.js">
        </script>
      <link src="./style.css" />
      <title>${title}</title>
    </head>
    <body>
      <div id="myChart"></div>
      <script type="module" src="/${entryFileName}"></script>
    </body>
  </html>
  `;

  return {
    "package.json": packageJson,
    [entryFileName]: entryFile,
    "style.css": styleCss,
    "index.html": indexHtml,
  };
};

export function getFrameworkProject({
  title,
  framework,
  internalFramework,
  entryFileName,
  entryFile,
}: {
  title: string;
  framework: string;
  internalFramework: string;
  entryFileName: string;
  entryFile: string;
}) {
  let files;

  /**
   * Stackblitz templates
   * @see https://developer.stackblitz.com/platform/api/javascript-sdk-options#projecttemplate
   */
  const template = "node"; // Since using vite for all templates, need to use `node` template
  const description = `AG Charts ${framework} example - ${title}`;

  if (framework === "react") {
    // TODO: Separate by internal framework
    files = getReactTsFiles({
      title,
      entryFileName,
      entryFile,
    });
  } else if (internalFramework === "vanilla") {
    files = getVanillaFiles({
      title,
      entryFileName,
      entryFile,
    });
  } else {
    return;
  }

  return {
    title,
    description,
    template,
    files,
  };
}
