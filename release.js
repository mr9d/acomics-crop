const fs = require('fs');
const package = require('./package.json');

const version = package.version;

const dir = `versions/${version}`;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
}

fs.copyFileSync('dist/bundle.js', `${dir}/bundle.js`);
fs.copyFileSync('dist/bundle.css', `${dir}/bundle.css`);
