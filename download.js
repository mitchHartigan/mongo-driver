"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { downloadMarkdown, downloadImages } = require("./_utils");
const chalk = require("chalk");

(async () => {
  client.connect(async (err) => {
    if (err) {
      console.log(chalk.red("Error connecting to database. Please try again."));
      console.log(err);
    }

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (environment !== "staging" && environment !== "production") {
      console.log(
        `Incorrect environment target '${chalk.red(
          environment
        )}'. Supported targets:\n`
      );
      console.log(">", chalk.blueBright("staging"));
      console.log(">", chalk.blueBright("production\n"));
      process.exit(0);
    }

    if (localTarget === "markdown") {
      const downloadComplete = await downloadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (downloadComplete) {
        console.log(
          `\nFinished downloading ${chalk.green(
            "markdown"
          )} files from ${chalk.blueBright(environment)} environment.`
        );
        process.exit(0);
      }
    }

    if (localTarget === "images") {
      const downloadComplete = await downloadImages(
        client,
        environment,
        "articles-images"
      );
      if (downloadComplete) {
        console.log(
          `\nFinished downloading ${chalk.green(
            "images"
          )} files from ${chalk.blueBright(environment)} environment.`
        );
        process.exit(0);
      }
    } else {
      console.log(
        `Incorrect folder target '${chalk.red(
          localTarget
        )}'. Supported targets:\n`
      );
      console.log(">", chalk.green("markdown"));
      console.log(">", chalk.green("images\n"));
      process.exit(0);
    }
  });
})();
