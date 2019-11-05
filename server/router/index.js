/**
 * Created by chenjiajun on 2019/11/4.
 */
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const uuidv1 = require('uuid/v1');
const rootPath = path.join(__dirname, '../../download/'); // 存放静态文件整个跟路径

const router = new Router();
const {
  getImg,
  getAllFinish,
  deleteFolder,
  compressingDir
} = require('../utils/utils');

router.get('/list', ctx => {
  const query = ctx.request.query;
  let uid = query.uid;
  const userRootPath =  `${rootPath}/${uid}`;

  if (!uid) {
    uid = uuidv1();
    ctx.body = {
      code: -1,
      uid
    };
    return;
  }

  if (!fs.existsSync(rootPath) || !fs.existsSync(userRootPath)) {
    ctx.body = {
      code: 0,
      list: []
    };
    return;
  }

  const files = fs.readdirSync(userRootPath);

  ctx.body = {
    code: 0,
    list: files
  }
});

router.post('/upload', async ctx => {
  const file = ctx.request.files.file;
  const uid = ctx.request.body.uid;
  const fileNameReg = /(.*).md$/;
  const fileName = file.name.match(fileNameReg)[1];
  const imgDirName = `${fileName.replace('(', '').replace(')', '')}-img`;
  const userRootPath =  `${rootPath}/${uid}`;
  const currFileRootPath = `${userRootPath}/${fileName}/`; // 当前文件跟路径
  const imgPath = `${currFileRootPath}/${imgDirName}/`; // 图片存放的路径
  const filePath = `${currFileRootPath}/${file.name}`; //markdown文件存放的路径
  const compressingPath = `download/${fileName}/.`; // 需要压缩的文件夹
  const saveCompressingPath = `${userRootPath}/${fileName}.tgz`; // 压缩文件存放的位置
  const prefixImgPath = `/images/${imgDirName}`; //新markdown中图片路径

  if (!uid) {
    ctx.body = {
      code: -1,
      message: '用户信息错误'
    };
    return;
  }

  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  if (!fs.existsSync(userRootPath)) {
    fs.mkdirSync(userRootPath);
  }

  if (!fs.existsSync(currFileRootPath)) {
    fs.mkdirSync(currFileRootPath);
  } else {
    deleteFolder(currFileRootPath);
    fs.mkdirSync(currFileRootPath);
  }

  let fileContent = fs.readFileSync(file.path, 'utf8');
  let fileContentString = fileContent.toString();
  const reg = /!\[.*\]\(([http|https].*)\)/g;
  const matchArr = fileContent.match(reg) || [];

  if (matchArr.length > 0) {
    const imgArr = [];
    if (!fs.existsSync(imgPath)) {
      fs.mkdirSync(imgPath);
    }
    const all = matchArr.map(async (item, index) => {
      const urlReg = /(\[.*\])\(([http|https].*)\)/;
      const matchResult = item.match(urlReg);
      const url = matchResult[2];
      const downloadUrl = `${imgPath}/${index + 1}.png`;
      await getImg(url, downloadUrl);
      imgArr.push({
        oldText: item,
        newText: `!${matchResult[1]}(${prefixImgPath}/${index + 1}.png)`
      });
    });

    await getAllFinish(all);

    imgArr.forEach(item => {
      fileContentString = fileContentString.replace(item.oldText, item.newText);
    });
  }

  fs.writeFileSync(filePath, fileContentString, 'utf8');

  // compressingDir(compressingPath, saveCompressingPath);

  return ctx.body = {
    code: 0,
    fileName: fileName,
    message: '上传成功'
  }
});

module.exports = router;

