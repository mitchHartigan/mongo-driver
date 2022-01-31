const mongodb = require("mongodb");
const fs = require("fs");
const command = require("nodemon/lib/config/command");

const CLEAR_GRIDFS_BUCKET = async (client, environment, collection) => {
  const fileCollection = client
    .db(`mortgagebanking-${environment}`)
    .collection(`${collection}.files`);

  await fileCollection.deleteMany({}, (err, result) => {
    if (err) console.log(err);
    console.log("clearGridFSBucket.files ", result);
  });

  const chunkCollection = client
    .db(`mortgagebanking-${environment}`)
    .collection(`${collection}.chunks`);

  await chunkCollection.deleteMany({}, (err, result) => {
    if (err) console.log(err);
    console.log("clearGridFSBucket.chunks", result);
  });
};

const UPLOAD = async (
  localFileName,
  dbFileName,
  client,
  environment,
  collection
) => {
  return new Promise((resolve, reject) => {
    const db = client.db(`mortgagebanking-${environment}`);

    var bucket = new mongodb.GridFSBucket(db, { bucketName: collection });

    fs.createReadStream(localFileName).pipe(
      bucket
        .openUploadStream(dbFileName)
        .on("error", (err) => console.log("err?", err))
        .on("finish", () => {
          console.log(`Finished upload for ${localFileName}`);
          resolve();
        })
    );
  });
};

const FETCH_MARKDOWN_NAMES = (client, environment) => {
  return new Promise((resolve, reject) => {
    const collection = client
      .db(`mortgagebanking-${environment}`)
      .collection("articles-markdown.files");

    collection.find({}).toArray((err, markdownFiles) => {
      if (err) console.log(err);
      let names = [];

      for (file of markdownFiles) {
        names.push(file.filename);
      }

      console.log("names \n" + names);
      resolve(names);
    });
  });
};

const DOWNLOAD = async (client, filename, environment) => {
  return new Promise((resolve, reject) => {
    const db = client.db(`mortgagebanking-${environment}`);

    const bucket = new mongodb.GridFSBucket(db, {
      chunkSizeBytes: 1024,
      bucketName: "articles-markdown",
    });

    bucket
      .openDownloadStreamByName(filename)
      .pipe(fs.createWriteStream(`./markdown/${filename}`))
      .on("error", (err) => console.log(err))
      .on("finish", () => {
        console.log(`Finished download for ${filename}`);
        resolve();
      });
  });
};

module.exports = {
  CLEAR_GRIDFS_BUCKET,
  UPLOAD,
  DOWNLOAD,
  FETCH_MARKDOWN_NAMES,
};
