"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { uploadMarkdown, uploadImages } = require("./_utils");
const chalk = require("chalk");

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
        `Incorrect environment target '${chalk.red(
          environment
        )}'. Supported environment targets:\n`
      );
      console.log(">", chalk.blueBright("staging"));
      console.log(">", chalk.blueBright("production\n"));
      process.exit(0);
    }

    if (localTarget === "markdown") {
      const uploadComplete = await uploadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (uploadComplete) {
        console.log(
          `\nFinished uploading ${chalk.green(
            "markdown"
          )} files to ${chalk.blueBright(environment)} environment.`
        );
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
        console.log(
          `\nFinished uploading ${chalk.green(
            "image"
          )} files to ${chalk.blueBright(environment)} environment.`
        );
        process.exit(0);
      }
    } else {
      console.log(
        `Incorrect local folder target '${chalk.red(
          localTarget
        )}'. Supported local folder targets:\n`
      );
      console.log(">", chalk.green("markdown"));
      console.log(">", chalk.green("images\n"));
      process.exit(0);
    }
  });
})();
