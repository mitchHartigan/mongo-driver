"use strict";

const dbUrl = ``;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { downloadMarkdown, downloadImages, download } = require("./_utils");
const { log } = require("./_log");

(async () => {
  client.connect(async (err) => {
    if (err) log.dbConnectErr();

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (environment !== "staging" && environment !== "production")
      log.envErr(environment);

    if (localTarget === "markdown") {
      const downloadComplete = await download(
        client,
        localTarget,
        environment,
        "articles-markdown"
      );
      if (downloadComplete) log.downloadComplete(environment, "markdown");
    }
    if (localTarget === "images") {
      const downloadComplete = await download(
        client,
        localTarget,
        environment,
        "articles-images"
      );
      if (downloadComplete) log.downloadComplete(environment, "images");
    } else log.localErr(localTarget);
  });
})();
