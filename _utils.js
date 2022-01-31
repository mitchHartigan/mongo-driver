const getNamesFromMarkdownFolder = () => {
  return fs.readdirSync("./markdown");
};

const uploadMarkdown = async (client, environment, collection) => {
  return new Promise(async (resolve) => {
    const markdown = getNamesFromMarkdownFolder();

    for (let i = 0; i <= markdown.length - 1; i++) {
      const path = `./markdown/${markdown[i]}`;
      await UPLOAD(path, markdown[i], client, environment, collection);
    }
    resolve(true);
  });
};
