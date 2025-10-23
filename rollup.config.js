import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/script.jsx", // After Effects에 쓸 파일(.jsx)
    format: "iife", // Immediately-invoked -> 전역에서 실행 가능
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      // tsconfig에서 target을 ES3로 두더라도 rollup/babel 등으로 추가 트랜스파일을 더할 수 있음
    }),
  ],
};
