const fs = require("fs");
const {
  UPLOAD,
  DOWNLOAD,
  CLEAR_GRIDFS_BUCKET,
  FETCH_MARKDOWN_NAMES,
} = require("./API");

const getNamesFromMarkdownFolder = () => {
  return fs.readdirSync("./markdown");
};

const deleteLocalMarkdown = async () => {
  const markdown = getNamesFromMarkdownFolder();

  for (let file of markdown) {
    const path = `./markdown/${file}`;

    await fs.unlink(path, () => {
      console.log(`Deleted file ${file}`);
    });
  }
};

const uploadMarkdown = async (client, environment, collection) => {
  return new Promise(async (resolve) => {
    const markdown = getNamesFromMarkdownFolder();

    if (markdown.length > 0) {
      await CLEAR_GRIDFS_BUCKET(client, environment, "articles-markdown");

      for (let i = 0; i <= markdown.length - 1; i++) {
        const path = `./markdown/${markdown[i]}`;
        await UPLOAD(path, markdown[i], client, environment, collection);
      }
      resolve(true);
    } else {
      console.log("Local markdown folder is empty. Nothing to upload.");
      process.exit(0);
    }
  });
};

const downloadMarkdown = async (client, environment, collection) => {
  return new Promise(async (resolve) => {
    await deleteLocalMarkdown();
    const filenames = await FETCH_MARKDOWN_NAMES(client, environment);

    for (filename of filenames) {
      await DOWNLOAD(client, filename, environment);
    }

    resolve();
  });
};

module.exports = {
  getNamesFromMarkdownFolder,
  uploadMarkdown,
  downloadMarkdown,
};
