const fs = require("fs");
const {
  UPLOAD,
  DOWNLOAD,
  CLEAR_GRIDFS_BUCKET,
  FETCH_MARKDOWN_NAMES,
  FETCH_IMAGE_NAMES,
} = require("./API");

const getNamesFromMarkdownFolder = () => {
  return fs.readdirSync("./markdown");
};

const getNamesFromImageFolder = () => {
  return fs.readdirSync("./images");
};

const deleteLocalMarkdown = async () => {
  const markdown = getNamesFromMarkdownFolder();

  for (let file of markdown) {
    const path = `./markdown/${file}`;

    await fs.unlink(path, () => {});
  }
  console.log("Finished deleting local files.");
};

const deleteLocalImages = async () => {
  const images = getNamesFromImageFolder();

  for (let image of images) {
    const path = `./images/${image}`;

    await fs.unlink(path, () => {});
  }
  console.log("Finished deleting local files.");
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

const uploadImages = async (client, environment, collection) => {
  return new Promise(async (resolve) => {
    const images = getNamesFromImageFolder();

    if (images.length > 0) {
      await CLEAR_GRIDFS_BUCKET(client, environment, "articles-images");

      for (let i = 0; i <= images.length - 1; i++) {
        const path = `./images/${images[i]}`;
        await UPLOAD(path, images[i], client, environment, collection);
      }
      resolve(true);
    } else {
      console.log("Local image folder is empty. Nothing to upload.");
      process.exit(0);
    }
  });
};

const downloadMarkdown = async (client, environment, bucket) => {
  return new Promise(async (resolve) => {
    await deleteLocalMarkdown();
    const filenames = await FETCH_MARKDOWN_NAMES(client, environment);

    for (filename of filenames) {
      await DOWNLOAD(client, filename, environment, bucket, "markdown");
    }

    resolve(true);
  });
};

const downloadImages = async (client, environment, bucket) => {
  return new Promise(async (resolve) => {
    await deleteLocalImages();
    const filenames = await FETCH_IMAGE_NAMES(client, environment);

    for (filename of filenames) {
      await DOWNLOAD(client, filename, environment, bucket, "images");
    }

    resolve(true);
  });
};

module.exports = {
  getNamesFromMarkdownFolder,
  uploadMarkdown,
  downloadMarkdown,
  downloadImages,
  uploadImages,
};
