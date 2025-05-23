import { defineConfig } from "tsup";

export default defineConfig({
  // 빌드를 위한 진입점 파일 지정
  entry: ["src/index.ts"],

  // CommonJS와 ECMAScript 모듈 둘 다 생성
  format: ["cjs", "esm"],

  // TypeScript 타입 선언 파일(.d.ts) 생성
  dts: true,

  // 빌드 전에 출력 디렉토리 정리
  clean: true,

  // 출력 파일 압축하지 않음
  minify: false,

  // ES2015(ES6) JavaScript 표준으로 컴파일
  target: "es2015",

  // 빌드 결과물을 위한 출력 디렉토리 지정
  outDir: "dist",
});
