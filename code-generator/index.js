const express = require('express');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const zipper = require('zip-local');
const fetch = require('node-fetch');

const app = express();
const port = 9011;

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

app.use((req, res, next) => {
  console.log("before");

  res.on('finish', () => {
    console.log("after", res.folder);
    fs.rmSync(res.folder, { recursive: true, force: true });
  });

  next();
});

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.post('/', async (req, res) => {
  const requestId = makeid(20);
  const fileurl = req.body.filepath;
  let file = null;
  if(fileurl) {
    const res = await fetch(fileurl)
    const text = await res.text();
    file = {name: fileurl.substring(fileurl.lastIndexOf('/')+1), data: Buffer.from(text, 'utf8')};
    console.log(file)
  } else {
    file = req.files.file;
  }
  const filepath = path.resolve(__dirname, file.name);
  const lang = req.body.lang;

  const folder = path.resolve(__dirname, 'buffer', requestId);
  const folder_result = path.resolve(folder, 'result');

  fs.mkdirSync(folder);
  fs.mkdirSync(folder_result);
  fs.createWriteStream(filepath).write(file.data);

  exec(`java -jar swagger-codegen-cli.jar generate -i ${filepath} -o ${folder_result} -l ${lang}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    zipper.sync.zip(folder_result).compress().save(path.resolve(folder, `${lang}-${requestId}.zip`));
    res.folder = folder;
    res.download(path.resolve(folder, `${lang}-${requestId}.zip`));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
