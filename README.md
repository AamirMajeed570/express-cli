# express-cli
# 🚀 create-express-app-cli

A lightweight and powerful CLI tool to quickly scaffold a modern **Express.js** application — in **JavaScript** or **TypeScript** — with one simple command.

Steps for Using the package.
Just install the package using the command
npm i -g create-express-app-cli
Then run the command.
create-express-app or
create-express-app-cli

Forget the manual setup!  
Just run a single command and get a complete Express app structure ready to go.

---

## ✨ Features

- 🧠 Choose between **JavaScript** or **TypeScript**
- ⚙️ Pre-configured with **nodemon / ts-node-dev**
- 🗂️ Organized folder structure (`routes`, `middleware`, etc.)
- 📦 Auto-generated `.gitignore` and `README.md`
- 🚀 Ready-to-run scripts for development and production
- 💡 Built-in sample API route and middleware

---

## 📦 Installation

You can use **npx** (recommended) or install it globally.

### Using `npx` (no installation needed)
```bash
npx create-express-app-cli my-app

🧰 Usage
? What is your project name? › my-app
? Do you want to use TypeScript or JavaScript? › TypeScript
# Once Complete
cd my-app
npm install
npm run dev

### For Typescript Project Structure
my-app/
├── src/
│   ├── routes/
│   │   └── index.ts
│   ├── middleware/
│   │   └── logger.ts
│   └── app.ts
├── index.ts
├── package.json
├── tsconfig.json
└── .gitignore

### For Javascript project Structure
my-app/
├── src/
│   ├── routes/
│   │   └── index.js
│   ├── middleware/
│   │   └── logger.js
│   └── app.js
├── index.js
├── package.json
└── .gitignore

### Exapmle Output
> npx create-express-app-cli my-app

✔ What is your project name? … my-app
✔ Choose language: › TypeScript
✔ Creating folders...
✔ Installing dependencies...
✔ Project setup complete!

👉 cd my-app
👉 npm install
👉 npm run dev

