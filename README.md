# Constellation

Constellation is ESA's social platform, built with Next.js and Strapi.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/)
-   **UI Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **CMS**: [Strapi](https://strapi.io/)

## Prerequisites

Ensure you have the following installed:

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd constellation-next
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and configure the following variables:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:1337/api
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js App Router structure:

-   `src/app`: Contains the application routes, pages, and layouts.
    -   `src/app/clubs`: Club-related pages.
    -   `src/app/users`: User management pages.
    -   `src/app/login` & `src/app/signup`: Authentication pages.
-   `src/components`: Reusable UI components (e.g., `Navbar`, `Galaxy`, `ClubList`).
-   `src/service`: API service modules for interacting with the Strapi backend (e.g., `userService.js`, `clubService.js`).
-   `src/context`: Global state management (e.g., `AuthContext`).

## Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
