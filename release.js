const fs = require('fs');
const sri = require('sri');
const package = require('./package.json');

const version = package.version;

const dir = `versions/${version}`;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
}

fs.copyFileSync('dist/bundle.js', `${dir}/bundle.js`);
fs.copyFileSync('dist/bundle.css', `${dir}/bundle.css`);

//
// See https://www.srihash.org/ for more info about this section
//
const jsSriHash = sri.getSRIString(`${dir}/bundle.js`);
const cssSriHash = sri.getSRIString(`${dir}/bundle.css`);

const readmeContent = `# Встраивание модуля на страницу

\`\`\`
<script defer src="https://cdn.jsdelivr.net/gh/mr9d/acomics-crop@master/versions/${version}/bundle.js" integrity="${jsSriHash}" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mr9d/acomics-crop@master/versions/${version}/bundle.css" integrity="${cssSriHash}" crossorigin="anonymous">
\`\`\`
`;

fs.writeFileSync(`${dir}/README.md`, readmeContent);
