const fs = require("fs");
const {
  UPLOAD,
  DOWNLOAD,
  CLEAR_GRIDFS_BUCKET,
  FETCH_FILE_NAMES,
} = require("./API");
const chalk = require("chalk");

const getNamesFromLocalFolder = (target) => {
  return fs.readdirSync(target);
};

const deleteLocalFiles = async (target) => {
  const files = getNamesFromLocalFolder(target);

  for (let file of files) {
    await fs.unlink(`${target}/${file}`, () => {});
  }
};

/* 
client = MongodbClient instance.
target = Either 'markdown' or 'images'.
environment = 'Staging' or 'production'.
collection = 'articles-markdown', 'articles-images' etc.
*/

const upload = async (client, target, environment, collection) => {
  return new Promise(async (resolve) => {
    const folderPath = `./${target}`;
    const files = getNamesFromLocalFolder(target);

    if (files.length > 0) {
      await CLEAR_GRIDFS_BUCKET(client, environment, collection);

      console.log(
        `\nUploading ${chalk.green(target)} to environment ${chalk.blueBright(
          environment
        )}.`
      );
      console.log("---------------------------------------------");

      for (let i = 0; i <= files.length - 1; i++) {
        const path = `${folderPath}/${files[i]}`;
        await UPLOAD(path, files[i], client, environment, collection);
      }
      resolve(true);
    } else {
      console.log(
        chalk.yellow(`Local ${target} folder is empty. Nothing to upload.`)
      );
      process.exit(0);
    }
  });
};

const download = async (client, target, environment, bucket) => {
  return new Promise(async (resolve) => {
    await deleteLocalFiles(target);
    const filenames = await FETCH_FILE_NAMES(client, target, environment);

    console.log(
      `\nDownloading ${chalk.green(target)} files from ${chalk.blueBright(
        environment
      )} environment:`
    );
    console.log("----------------------------------------");
    for (filename of filenames) {
      await DOWNLOAD(client, filename, environment, bucket, target);
    }

    resolve(true);
  });
};

module.exports = {
  upload,
  download,
};
