const chalk = require("chalk");

const log = {
  envErr: (environment) => {
    console.log(
      `\nIncorrect environment target '${chalk.redBright(
        environment
      )}'. Supported targets:\n`
    );
    console.log(">", chalk.blueBright("staging"));
    console.log(">", chalk.blueBright("production\n"));
    process.exit(0);
  },

  localErr: (localTarget) => {
    console.log(
      `\nIncorrect folder target '${chalk.redBright(
        localTarget
      )}'. Supported targets:\n`
    );
    console.log(">", chalk.green("markdown"));
    console.log(">", chalk.green("images\n"));
    process.exit(0);
  },
  dbConnectErr: () => {
    console.log(chalk.red("Error connecting to database. Please try again."));
    console.log(err);
  },
  downloadComplete: (environment, type) => {
    console.log(
      `\nFinished downloading ${chalk.green(
        type
      )} files from ${chalk.blueBright(environment)} environment.`
    );
    process.exit(0);
  },
  uploadComplete: (environment, type) => {
    console.log(
      `\nFinished uploading ${chalk.green(type)} files to ${chalk.blueBright(
        environment
      )} environment.`
    );
    process.exit(0);
  },
};

module.exports = { log };
