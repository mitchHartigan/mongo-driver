# mongo-driver

A CLI tool to assist in managing the deployed staging and production MortgageBanking environments.

# Installation
1. Install [Node.js](https://nodejs.org/en/). Version 16.13 LTS is recommended.
2. Clone this repository (or download via .zip) locally.
3. Navigate to the local ```/mongo-driver``` project folder with Windows Powershell (recommended) or other terminal.
4. Verify NodeJS installation by running ```node -v```. The node version (ie, ```v16.13.0```) will be returned if NodeJS has been installed correctly.
5. Run ```npm install``` and wait for the required project dependencies to be installed locally.
6. Done!

# Usage

Currently, there are 2 supported commands:

# ```node upload <content> <environment>```:

Takes the specified folder (```content```) and uploads it's contents to the specified environment (```environment```).

Eg, ```node upload markdown staging``` would take all of the ```.md``` files from the local ```/markdown``` folder, and upload them to the mortgagebanking-staging environment. The ```.md``` files stored in the mortgagebanking-staging environment would be replaced with the contents of the local ```/markdown``` folder.

# ```node download <content> <environment>```:

Downloads the specified content (```content```) from the specified environment (```environment```) to the matching local folder.

Eg, ```node download markdown production``` would download all of the ```.md``` files from the mortgagebanking-production environment into the local ```/markdown``` folder.
The ```.md``` files stored in the local ```/markdown``` folder would be replaced with the contents of the mortgagebanking-production environment.


# List of Accepted Commands:

* ```node upload markdown staging```
* ```node upload markdown production```
* ```node upload images staging```
* ```node upload images production```

* ```node download markdown staging```
* ```node download markdown production```
* ```node download images staging```
* ```node download images production```
