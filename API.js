const mongodb = require("mongodb");
const fs = require("fs");

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

module.exports = { CLEAR_GRIDFS_BUCKET, UPLOAD };
