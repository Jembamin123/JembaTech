import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**", "node_modules/**", "android/**"] },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
