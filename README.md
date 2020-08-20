# qr.js
## Getting Started
Download from the latest release or build from source

### The Latest Release
[Link](https://github.com/csc309-summer-2020/js-library-shenjunw/releases/latest)

### Build from Source

#### Clone Repository
```
git clone https://github.com/csc309-summer-2020/js-library-shenjunw.git
```
#### Install Dependencies
Prerequisite: Nodejs installed
```
npm install
```
#### Build the Library
```
npm build
```
The compiled JavaScript file is in `./public/javascripts/` folder, named `library.js`
#### Start Local Landing / Example Pages
```
npm start
```
This will start an Express server at localhost:3000

### Usage

#### Browser
Put the script tag `<script src="library.js">`  before `</body>` tag

#### CommonJS
```Javascript
const qr = require("./library");
```

Now you can call API functions in your scripts on `qr`.

## Deployment
[Landing Page](https://blooming-retreat-31199.herokuapp.com) <br>
[Documentations](https://blooming-retreat-31199.herokuapp.com/docs/index.html)
