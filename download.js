"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { downloadMarkdown } = require("./_utils");

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
        `Incorrect environment target '${environment}'. Supported targets:`
      );
      console.log("> staging");
      console.log("> production");
      process.exit(0);
    }

    if (localTarget === "markdown") {
      const downloadComplete = await downloadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (downloadComplete) {
        console.log(`Finished downloading markdown files from ${environment}.`);
        process.exit(0);
      }
    } else {
      console.log(
        `Incorrect folder target '${localTarget}'. Supported targets:`
      );
      console.log("> markdown");
      process.exit(0);
    }
  });
})();
