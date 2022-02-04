"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { downloadMarkdown, downloadImages } = require("./_utils");
const { handler } = require("./_handler");

(async () => {
  client.connect(async (err) => {
    if (err) handler.dbConnectErr();

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (environment !== "staging" && environment !== "production")
      handler.envErr(environment);

    if (localTarget === "markdown") {
      const downloadComplete = await downloadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (downloadComplete) handler.downloadComplete(environment, "markdown");
    }

    if (localTarget === "images") {
      const downloadComplete = await downloadImages(
        client,
        environment,
        "articles-images"
      );
      if (downloadComplete) handler.downloadComplete(environment, "images");
    } else handler.localErr(localTarget);
  });
})();
