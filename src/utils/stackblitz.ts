import sdk from "@stackblitz/sdk";

export function openProject({ title, entryFileName, entryFile, isEnterprise }) {
  const entryFilePath = `src/${entryFileName}`;
  const packageJson = `{
    "name": "vite-react-typescript-starter",
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

  const project = {
    title,
    description: `AG Charts example - ${title}`,
    template: "node",
    files: {
      "package.json": packageJson,
      [entryFilePath]: entryFile,
      "src/style.css": styleCss,
      "index.html": indexHtml,
      "vite.config.ts": viteConfig,
    },
  };

  sdk.openProject(project);
}
