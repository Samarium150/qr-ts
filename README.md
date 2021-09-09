# qr-ts

[![GitHub top language](https://img.shields.io/github/languages/top/Samarium150/qr.ts?style=flat)](https://www.typescriptlang.org/)
[![Build](https://github.com/Samarium150/qr-ts/actions/workflows/build.yml/badge.svg)](https://github.com/Samarium150/qr-ts/actions/workflows/build.yml)
[![LICENSE](https://img.shields.io/github/license/Samarium150/qr.ts?style=flat)](https://github.com/Samarium150/qr.ts/blob/master/LICENSE)

Create QR code on HTML canvas.

The main purpose of creating this library is learning TypeScript, different build tools and the QR code algorithm.

For production usage, please choose [node-qrcode](https://github.com/soldair/node-qrcode).

The original version is on `legacy` branch, which was developed during an undergraduate web-developing course.

## Installation

```shell
yarn add qr-ts
```

## Usage

### Browser
```html
<body>
<div id="main"></div>
<script type="application/javascript" src="node_modules/qr-ts/dist/browser/index.js"></script>
<script>
  const code = qr.renderOnCanvas(qr.generate("test"), "output");
  const prev = document.getElementById("output");
  if (prev != null) prev.replaceWith(code);
  else document.getElementById("main").appendChild(code);
</script>
</body>
```

### CommonJS
```Javascript
const qr = require("qr-ts");
// This prints out the instance of QR class, see docs for more info
console.log(qr.generate("test")); 
```
run with `node index.js`

### ESM/TypeScript
```typescript
import * as qr from "qr-ts";
console.log(qr.generate("test")); // same as above
```
run with `esm` or `ts-node`

i.e. `node -r esm index.mjs` or `ts-node index.ts`

## Deployment

[Documentations](https://samarium150.github.io/qr-ts/)
