# Contributing to this project

Thank you for your interest in contributing!  
This document explains how to set up the project, the contribution process, and the coding conventions we follow.

---

## 🛠️ Getting Started

### 0. Prerequisites

Ensure you have the following installed:

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

### 1. Fork & clone the following repositories
```bash
git clone https://github.com/GuillaumeHaben/constellation-next.git
git clone https://github.com/GuillaumeHaben/constellation-strapi.git
```

### 2. Install dependencies in each repository

`npm install`

### 2.1 Add environment variables

Add environment variables in `constellation-next/.env.local`.
`NEXT_PUBLIC_API_URL=http://localhost:1337`

Add environment variables in `constellation-strapi/.env`.

```bash
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
JWT_SECRET=
GOOGLE_MAPS_API_KEY=
```

### 2.2 Install dependencies in Strapi

`npm install`

### 3. Run the project

(For Next.js / React app)

`npm run dev`

(For Strapi)

`npm run dev`

Open [http://localhost:3000](http://localhost:3000) to see the result.

If you encounter issues, please open an Issue or Discussion.

---

## 🧩 Project Structure

/app                # App pages
/components         # Reusable UI components
/context            # Context providers
/service            # Backend / API communication
/utils              # Helpers, utilities

---

## 🚀 How to Contribute

### 1. Pick or open an Issue

    Look for issues labeled good first issue or help wanted

    Or create a new Issue to propose changes

### 2. Create a feature branch

`git checkout -b feat/some-feature`

Branch prefixes:

    `feat/` – new feature

    `fix/` – bug fix

    `chore/` – tooling, CI, dependencies, cleanup

### 3. Commit conventions

Use meaningful commit messages:

`feat: add progress bar to quiz screen`
`fix: correct crash when loading user profile`
`chore: update installation instructions`

### 4. Before opening a Pull Request

Please ensure:

    the project builds successfully `npm run build`

    linting passes `npm run lint`

### 5. Open a Pull Request

Include:

    a short summary of what changed

    screenshots for UI changes

    reference the Issue number

A maintainer will review your PR as soon as possible.

## 🧪 Tests

If tests exist, run them:

`npm test`

If not, contributions to testing are welcome!

Thank you for contributing! 🚀