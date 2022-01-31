"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const fs = require("fs");
const { UPLOAD, CLEAR_GRIDFS_BUCKET } = require("./API");
const client = new MongoClient(dbUrl);

(async () => {
  client.connect(async (err) => {
    if (err) {
      console.log("Error connecting to database. Please try again.");
      console.log(err);
    }

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (localTarget === "markdown") {
      const markdown = getNamesFromMarkdownFolder();

      if (markdown.length > 0) {
        console.log("Removing existing markdown files...");
        await CLEAR_GRIDFS_BUCKET(client, environment, "articles-markdown");
        console.log("Files removed. Uploading new files...");
        const uploadComplete = await uploadMarkdown(
          markdown,
          client,
          environment,
          "articles-markdown"
        );
        if (uploadComplete) {
          console.log(`Finished uploading markdown files to ${environment}`);
          process.exit(0);
        }
      } else {
        console.log("Local /markdown folder is empty. Nothing to upload.");
        process.exit(0);
      }
    }
  });
})();

const getNamesFromMarkdownFolder = () => {
  return fs.readdirSync("./markdown");
};

const uploadMarkdown = async (markdown, client, environment, collection) => {
  return new Promise(async (resolve) => {
    for (let i = 0; i <= markdown.length - 1; i++) {
      const path = `./markdown/${markdown[i]}`;
      await UPLOAD(path, markdown[i], client, environment, collection);
      resolve(true);
    }
  });
};
