/**
 * Created by chenjiajun on 2019/11/5.
 */
const request = require('request');
const fs = require('fs');
const compressing = require('compressing');

const getImg = (url, downloadUrl) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(downloadUrl);
    request(url).pipe(writeStream);
    writeStream.on("finish", function () {
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
    Promise.all(all).then(() => {
      console.log('全部完成');
    }).then(() => {
      resolve();
    }).then(() => {
      reject();
    });
  })
};

const deleteFolder = path => {
  fs.readdirSync(path).forEach(file => {
    const filePath = `${path}/${file}`;
    if (fs.lstatSync(filePath).isDirectory()) {
      deleteFolder(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
  fs.rmdirSync(path);
};

const compressingDir = (dir, savePath) => {
  return new Promise((resolve, reject) => {
    compressing.tgz.compressDir(dir, savePath)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

module.exports = {
  getImg,
  getAllFinish,
  deleteFolder,
  compressingDir
};
