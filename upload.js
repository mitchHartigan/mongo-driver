"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { uploadMarkdown, uploadImages } = require("./_utils");

(async () => {
  client.connect(async (err) => {
    if (err) {
      console.log("Error connecting to database. Please try again.");
      console.log(err);
    }

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (environment !== "staging" && environment !== "production") {
      console.log(
        `Incorrect environment target '${environment}'. Supported environment targets:`
      );
      console.log("> staging");
      console.log("> production");
      process.exit(0);
    }

    if (localTarget === "markdown") {
      const uploadComplete = await uploadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (uploadComplete) {
        console.log(`Finished uploading markdown files to ${environment}`);
        process.exit(0);
      }
    }
    if (localTarget === "images") {
      const uploadComplete = await uploadImages(
        client,
        environment,
        "articles-images"
      );
      if (uploadComplete) {
        console.log(`Finished uploading image files to ${environment}`);
        process.exit(0);
      }
    } else {
      console.log(
        `Incorrect folder target '${localTarget}'. Supported folder targets:`
      );
      console.log("> markdown");
      console.log("> images");
      process.exit(0);
    }
  });
})();
