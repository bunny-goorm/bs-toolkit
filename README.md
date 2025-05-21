# bs-toolkit

[![npm version](https://img.shields.io/npm/v/bs-toolkit.svg?style=flat-square)](https://www.npmjs.com/package/bs-toolkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/bs-toolkit.svg?style=flat-square)](https://bundlephobia.com/result?p=bs-toolkit)
[![license](https://img.shields.io/github/license/bunny-goorm/bs-toolkit.svg?style=flat-square)](https://github.com/bunny-goorm/bs-toolkit/blob/main/LICENSE)

A lightweight, type-safe debounce and throttle utility library that works in both browser and Node.js environments.

## Installation

```bash
npm install bs-toolkit
# or
yarn add bs-toolkit
```

## Examples

```js
import { debounce, throttle } from "bs-toolkit";

const onInput = debounce(() => {
  console.log("Input finalized (debounced)");
}, 300);

const inputEl = document.getElementById("search-input");
inputEl?.addEventListener("input", onInput);

const onScroll = throttle(() => {
  console.log("Scroll event triggered (throttled)");
}, 500);

window.addEventListener("scroll", onScroll);
```
