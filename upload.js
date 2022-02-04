"use strict";

const dbUrl = `mongodb+srv://admin:bjX2dGUEnrK4Zyd@cluster0.vl3pn.mongodb.net/food?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(dbUrl);

const { uploadMarkdown, uploadImages } = require("./_utils");
const { log } = require("./_log");

(async () => {
  client.connect(async (err) => {
    if (err) log.dbConnectErr();

    const localTarget = process.argv[2];
    const environment = process.argv[3];

    if (environment !== "staging" && environment !== "production")
      log.envErr(env);

    if (localTarget === "markdown") {
      const uploadComplete = await uploadMarkdown(
        client,
        environment,
        "articles-markdown"
      );
      if (uploadComplete) log.uploadComplete(environment, "markdown");
    }
    if (localTarget === "images") {
      const uploadComplete = await uploadImages(
        client,
        environment,
        "articles-images"
      );
      if (uploadComplete) log.uploadComplete(environment, "images");
    } else log.localErr(localTarget);
  });
})();
