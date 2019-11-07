/**
 * Created by chenjiajun on 2019/11/4.
 */
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const uuidv1 = require('uuid/v1');
const rootPath = path.join(__dirname, '../../download/'); // 存放静态文件整个跟路径
const filter = require('../utils/filter');

const router = new Router();
const {
  getImg,
  getAllFinish,
  deleteFolder,
  compressingMulDir,
  getImgName
} = require('../utils/utils');

router.get('/list', ctx => {
  let { uid } = ctx.request.query;
  const userRootPath = `${rootPath}/${uid}`;

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
  const dirs = files.filter(item => {
    return fs.lstatSync(`${userRootPath}/${item}`).isDirectory()
  });

  ctx.body = {
    code: 0,
    list: dirs
  }
});

router.post('/upload', filter, async ctx => {
  const { file } = ctx.request.files;
  const { uid } = ctx.request.body;
  const fileNameReg = /(.*).md$/;
  const fileName = file.name.match(fileNameReg)[1];
  const imgDirName = getImgName(fileName);
  const userRootPath = `${rootPath}/${uid}`; // 当前用户根目录
  const currFileUserRootPath = `${userRootPath}/${fileName}/`; // 当前文件在当前用户下的跟路径
  const imgPath = `${currFileUserRootPath}/${imgDirName}/`; // 图片存放的路径
  const filePath = `${currFileUserRootPath}/${file.name}`; //markdown文件存放的路径
  // const compressingPath = `download/${fileName}/.`; // 需要压缩的文件夹
  // const saveCompressingPath = `${userRootPath}/${fileName}.tgz`; // 压缩文件存放的位置
  const prefixImgPath = `/images/${imgDirName}`; //新markdown中图片路径

  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  if (!fs.existsSync(userRootPath)) {
    fs.mkdirSync(userRootPath);
  }

  if (!fs.existsSync(currFileUserRootPath)) {
    fs.mkdirSync(currFileUserRootPath);
  } else {
    deleteFolder(currFileUserRootPath);
    fs.mkdirSync(currFileUserRootPath);
  }

  const fileContent = fs.readFileSync(file.path, 'utf8');
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

router.post('/deleteFiles', filter, ctx => {
  const { uid, fileNames } = ctx.request.body;
  const userRootPath = `${rootPath}/${uid}`; // 当前用户根目录

  if (fileNames.length > 0) {
    fileNames.forEach(item => {
      const filePath = `${userRootPath}/${item}`;
      deleteFolder(filePath);
    });
  }

  ctx.body = {
    code: 0
  }
});


router.get('/download', async ctx => {
  const { uid, type, fileNames } = ctx.request.query;
  const userRootPath = `${rootPath}/${uid}`; // 当前用户根目录
  const temp = +new Date();
  const fileArr = JSON.parse(fileNames);
  let compressDirArr = [];

  if (!uid) {
    ctx.body = {
      code: -1,
      message: '用户信息不全，请刷新网页'
    };

    return;
  }

  if (type === 'markdown') {
    fileArr.forEach(item => {
      fs.readdirSync(`${userRootPath}/${item}`).forEach(file => {
        if (!fs.lstatSync(`${userRootPath}/${item}/${file}`).isDirectory()) {
          compressDirArr.push(`download/${uid}/${item}/${file}`);
        }
      });
    });

    await compressingMulDir(compressDirArr, `download/${uid}/${temp}-markdown文件.tgz`);
    ctx.body = {
      code: 0,
      url: `http://localhost:8008/${uid}/${temp}-markdown文件.tgz`
    };
    return;
  }


  if (type === 'images') {
    fileArr.forEach(item => {
      fs.readdirSync(`${userRootPath}/${item}`).forEach(file => {
        if (fs.lstatSync(`${userRootPath}/${item}/${file}`).isDirectory()) {
          compressDirArr.push(`download/${uid}/${item}/${file}`);
        }
      });
    });

    await compressingMulDir(compressDirArr, `download/${uid}/${temp}-图片.tgz`);
    ctx.body = {
      code: 0,
      url: `http://localhost:8008/${uid}/${temp}-图片.tgz`
    };
    return;
  }


  fileArr.forEach(item => {
    compressDirArr.push(`download/${uid}/${item}/.`);
  });

  await compressingMulDir(compressDirArr, `download/${uid}/${temp}-markdown和图片.tgz`);

  ctx.body = {
    code: 0,
    url: `http://localhost:8008/${uid}/${temp}-markdown和图片.tgz`
  }
});

router.post('/clearAll', ctx => {
  const { uid } = ctx.request.body;
  const userRootPath = `${rootPath}/${uid}`; // 当前用户根目录
  if (fs.existsSync(userRootPath)) {
    deleteFolder(userRootPath);
  }
  ctx.body = {
    code: 0
  }
});

module.exports = router;

