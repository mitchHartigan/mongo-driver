const mongodb = require("mongodb");
const fs = require("fs");

const chalk = require("chalk");

// https://mongodb.github.io/node-mongodb-native/3.2/api/GridFSBucket.html

const CLEAR_GRIDFS_BUCKET = async (client, environment, collection) => {
  const fileCollection = client
    .db(`mortgagebanking-${environment}`)
    .collection(`${collection}.files`);

  await fileCollection.deleteMany({}, (err, result) => {
    if (err) console.log(err);
  });

  const chunkCollection = client
    .db(`mortgagebanking-${environment}`)
    .collection(`${collection}.chunks`);

  await chunkCollection.deleteMany({}, (err, result) => {
    if (err) console.log(err);
  });
};

FETCH_FILE_NAMES = (client, target, environment) => {
  return new Promise((resolve, reject) => {
    const collection = client
      .db(`mortgagebanking-${environment}`)
      .collection(`articles-${target}.files`);

    collection.find({}).toArray((err, files) => {
      if (err) console.log(err);
      let names = [];

      for (file of files) {
        names.push(file.filename);
      }

      resolve(names);
    });
  });
};

const UPLOAD = async (
  localFileName,
  dbFileName,
  client,
  environment,
  bucketName
) => {
  return new Promise((resolve, reject) => {
    const db = client.db(`mortgagebanking-${environment}`);

    var bucket = new mongodb.GridFSBucket(db, { bucketName: bucketName });

    fs.createReadStream(localFileName).pipe(
      bucket
        .openUploadStream(dbFileName)
        .on("error", (err) => console.log("err?", err))
        .on("finish", () => {
          console.log(chalk.green(`  + ${localFileName}`));
          resolve();
        })
    );
  });
};

const DOWNLOAD = async (
  client,
  filename,
  environment,
  bucketName,
  targetFolder
) => {
  return new Promise((resolve, reject) => {
    const db = client.db(`mortgagebanking-${environment}`);

    const bucket = new mongodb.GridFSBucket(db, {
      chunkSizeBytes: 1024,
      bucketName: bucketName,
    });

    bucket
      .openDownloadStreamByName(filename)
      .pipe(fs.createWriteStream(`./${targetFolder}/${filename}`))
      .on("error", (err) => console.log(err))
      .on("finish", () => {
        console.log(chalk.green(` + ${filename}`));
        resolve();
      });
  });
};

module.exports = {
  CLEAR_GRIDFS_BUCKET,
  UPLOAD,
  DOWNLOAD,
  FETCH_FILE_NAMES,
};
