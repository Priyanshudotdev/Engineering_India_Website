import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Migrated from .eslintrc.cjs
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-no-undef": "off",
      // React Compiler rules. This project does not use React Compiler, and
      // these rules flag standard patterns used throughout the codebase
      // (data fetching in effects, form prefill from session, mount guards
      // for hydration safety, matchMedia subscriptions) as well as upstream
      // shadcn/ui code (embla carousel, sidebar skeleton, Date fallbacks).
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
  // Migrated from .eslintignore (plus Next.js defaults)
  globalIgnores([
    // Next.js defaults
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Dependencies
    "node_modules/**",
    ".pnp",
    ".pnp.js",
    // Production builds
    "dist/**",
    // Environment
    ".env",
    ".env.local",
    ".env.*.local",
    // Logs
    "*.log",
    // Testing
    "coverage/**",
    // Cache
    ".cache/**",
    ".turbo/**",
  ]),
]);

export default eslintConfig;
