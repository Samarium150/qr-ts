# qr.js
## Getting Started
Download from the latest release or build from source

### The Latest Release
[Link](https://github.com/Samarium150/qr.ts/releases/latest)

### Build from Source

#### Clone Repository
```
git clone https://github.com/Samarium150/qr.ts.git
```

#### Install Dependencies
Prerequisite: Node.js installed
```
npm install
```

#### Build the Library
In production mode:
```
npm run build
```
In development mode:
```
npm run devBuild
```
The compiled JavaScript file is in `./public/javascripts/` folder, named `library.js`

#### Start Local Landing / Example Pages
Start an Express server at localhost:3000
```
npm run start
```
Start the server by [`nodemon`](https://github.com/remy/nodemon)
```
npm run dev
```

### Usage

#### Browser
Put the script tag `<script src="library.js">`  before `</body>` tag

#### CommonJS
```Javascript
const qr = require("./library");
```

Now you can call API functions in your scripts on `qr`.

## Further Development
- Move to personal repository (instead of organization's)
- Adding tests
- Publish to NPM

## Deployment
[Landing Page](https://blooming-retreat-31199.herokuapp.com) <br>
[Documentations](https://blooming-retreat-31199.herokuapp.com/docs/index.html)
