import typescript from "rollup-plugin-typescript2";
import alias from "@rollup/plugin-alias";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname;

export default {
  input: "src/main.ts",
  output: {
    file: "dist/script.jsx", // After Effects에 쓸 파일(.jsx)
    format: "iife", // Immediately-invoked -> 전역에서 실행 가능
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [
        {
          find: "$src",
          replacement: path.resolve(projectRoot, "src"),
        },
        {
          find: "$utils",
          replacement: path.resolve(projectRoot, "src/utils"),
        },
        {
          find: "$types",
          replacement: path.resolve(projectRoot, "src/types"),
        },
        {
          find: "$components",
          replacement: path.resolve(projectRoot, "src/components"),
        },
        {
          find: "$errors",
          replacement: path.resolve(projectRoot, "src/errors"),
        },
        {
          find: "$windows",
          replacement: path.resolve(projectRoot, "src/windows"),
        },
      ],
    }),
    typescript({
      tsconfig: "tsconfig.json",
      // tsconfig에서 target을 ES3로 두더라도 rollup/babel 등으로 추가 트랜스파일을 더할 수 있음
    }),
  ],
};
