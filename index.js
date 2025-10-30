#!/usr/bin/env node
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createExpressApp() {
  console.log("🛠️  Welcome to Create Express App!\n");

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-express-app",
    },
    {
      type: "list",
      name: "language",
      message: "Choose language:",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "input",
      name: "extraPackages",
      message:
        "Enter any extra NPM packages you want to install (space-separated, or leave blank):",
    },
  ]);

  const { projectName, language, extraPackages } = answers;
  const projectDir =
    projectName === "." ? process.cwd() : path.join(process.cwd(), projectName);

  if (projectName !== "." && fs.existsSync(projectDir)) {
    console.log(`❌ Folder "${projectName}" already exists. Please choose another name.`);
    process.exit(1);
  }

  if (projectName !== ".") fs.mkdirSync(projectDir);

  console.log(`\n📦 Creating ${language} Express app in ${projectDir}\n`);

  // --- Step 1: Create package.json ---
  const pkg = {
    name: path.basename(projectDir),
    version: "1.0.0",
    main: language === "TypeScript" ? "dist/index.js" : "index.js",
    license: "MIT",
    scripts: {},
    dependencies: { express: "^4.19.2" },
    devDependencies: {},
  };

  if (language === "JavaScript") {
    pkg.scripts = {
      start: "node index.js",
      dev: "nodemon index.js",
    };
    pkg.devDependencies["nodemon"] = "^3.1.0";
  } else {
    pkg.scripts = {
      dev: "ts-node-dev --respawn index.ts",
      build: "tsc",
      start: "node dist/index.js",
    };
    pkg.devDependencies = {
      typescript: "^5.3.3",
      "ts-node-dev": "^2.0.0",
      "@types/express": "^4.17.21",
      "@types/node": "^20.5.7",
    };
  }

  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  // --- Step 2: Create folders ---
  const folders = ["src/routes", "src/controllers", "src/middlewares"];
  folders.forEach((f) => fs.mkdirSync(path.join(projectDir, f), { recursive: true }));

  const ext = language === "TypeScript" ? "ts" : "js";

  // --- Step 3: Template files ---
  const appFile =
    language === "JavaScript"
      ? `
import express from "express";
import router from "./routes/index.js";
import logger from "./middlewares/logger.js";

const app = express();
app.use(express.json());
app.use(logger);
app.use("/", router);

export default app;
`
      : `
import express from "express";
import router from "./routes/index";
import logger from "./middlewares/logger";

const app = express();
app.use(express.json());
app.use(logger);
app.use("/", router);

export default app;
`;

  const rootIndexFile =
    language === "JavaScript"
      ? `
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));
`
      : `
import app from "./src/app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));
`;

  const routeFile =
    language === "JavaScript"
      ? `
import express from "express";
import { homeController } from "../controllers/home.js";

const router = express.Router();
router.get("/", homeController);

export default router;
`
      : `
import express from "express";
import { homeController } from "../controllers/home";

const router = express.Router();
router.get("/", homeController);

export default router;
`;

  const controllerFile =
    language === "JavaScript"
      ? `
export const homeController = (req, res) => {
  res.json({ message: "Hello from Express + JavaScript!" });
};
`
      : `
import { Request, Response } from "express";

export const homeController = (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript!" });
};
`;

  const middlewareFile =
    language === "JavaScript"
      ? `
const logger = (req, res, next) => {
  console.log(\`[LOG] \${req.method} \${req.url}\`);
  next();
};

export default logger;
`
      : `
import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(\`[LOG] \${req.method} \${req.url}\`);
  next();
};

export default logger;
`;

  // --- Write files ---
  fs.writeFileSync(path.join(projectDir, `index.${ext}`), rootIndexFile.trimStart());
  fs.writeFileSync(path.join(projectDir, `src/app.${ext}`), appFile.trimStart());
  fs.writeFileSync(path.join(projectDir, `src/routes/index.${ext}`), routeFile.trimStart());
  fs.writeFileSync(path.join(projectDir, `src/controllers/home.${ext}`), controllerFile.trimStart());
  fs.writeFileSync(path.join(projectDir, `src/middlewares/logger.${ext}`), middlewareFile.trimStart());

  // --- Step 4: tsconfig (for TS only) ---
  if (language === "TypeScript") {
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        module: "CommonJS",
        rootDir: ".",
        outDir: "dist",
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
      },
      include: ["src/**/*", "index.ts"],
    };
    fs.writeFileSync(
      path.join(projectDir, "tsconfig.json"),
      JSON.stringify(tsconfig, null, 2)
    );
  }

  // --- Step 5: .gitignore ---
  const gitignore = `
node_modules
dist
.env
.DS_Store
npm-debug.log*
`;
  fs.writeFileSync(path.join(projectDir, ".gitignore"), gitignore.trimStart());

  // --- Step 6: README.md ---
  const readme = `
# ${pkg.name}

A simple Express ${language} starter generated with \`create-express-app\`.

## 🚀 Folder Structure
\`\`\`
.
 ├── src/
 │   ├── routes/
 │   ├── controllers/
 │   ├── middlewares/
 │   └── app.${ext}
 ├── index.${ext}
 ├── package.json
 ├── .gitignore
 └── README.md
\`\`\`

## 🧰 Quick Start
\`\`\`bash
cd ${projectName === "." ? "." : pkg.name}
npm install
npm run dev
\`\`\`
`;
  fs.writeFileSync(path.join(projectDir, "README.md"), readme.trimStart());

  // --- Step 7: Install dependencies ---
  console.log("\n📥 Installing dependencies...\n");
  execSync("npm install", { cwd: projectDir, stdio: "inherit" });

  if (extraPackages.trim() !== "") {
    console.log(`\n📦 Installing extra packages: ${extraPackages}\n`);
    execSync(`npm install ${extraPackages}`, { cwd: projectDir, stdio: "inherit" });
  }

  console.log(`\n✅ Setup complete!`);
  console.log(`\nTo start:\n  cd ${projectName === "." ? "." : pkg.name}\n  npm run dev\n`);
}

createExpressApp();
