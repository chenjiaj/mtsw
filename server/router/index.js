/**
 * Created by chenjiajun on 2019/11/4.
 */
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const request = require('request');
const router = new Router();

const getImg = (url, downloadUrl) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(downloadUrl);
    request(url).pipe(writeStream);
    writeStream.on("finish", function () {
      console.log('-- 完成');
      writeStream.end();
      resolve();
    });

    writeStream.on("error", function () {
      writeStream.end();
      reject();
    });
  });
};

const getAllFinish = all => {
  return new Promise((resolve, reject) => {
    Promise.all(all).then(()=>{
      console.log('全部完成');
    }).then(()=>{
      resolve();
    }).then(()=>{
      reject();
    });
  })
};

router.post('/upload', async ctx => {
  const file = ctx.request.files.file;
  // const reader = fs.createReadStream(file.path);
  // const uploadPath = path.join(__dirname, '../../upload/');
  const downloadPath = path.join(__dirname, '../../download/');
  // let filePath = uploadPath + `${file.name}`;
  //
  // if (!fs.existsSync(uploadPath)) {
  //   fs.mkdirSync(uploadPath);
  // }

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }

  // const upStream = fs.createWriteStream(filePath);
  // reader.pipe(upStream);

  const fileContent = fs.readFileSync(file.path, 'utf8');
  const reg = /!\[.*\]\(([http|https].*)\)/g;
  const matchArr = fileContent.match(reg) || [];

  if (matchArr.length > 0) {
    const all = matchArr.map(async (item, index) => {
      const urlReg = /\(([http|https].*)\)/;
      const url = item.match(urlReg)[1];
      const downloadUrl = `${downloadPath}${file.name}${index}.png`;
      await getImg(url, downloadUrl);
      console.log('完成1');
    });

    await getAllFinish(all);

    console.log('最后执行');
  }

  return ctx.body = {
    code: 0,
    message: '上传成功'
  }
});

module.exports = router;

