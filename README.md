# Dare Nodejs Assessment

A middleware API that connect clients and admins to an insurance API.

---

## Requirements

For development, you will only need Node.js and a node global package, npm or yarn, installed in your environnement.

### Node Installation

<details><summary><b>Show installation instructions</b></summary>

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18.3

    $ npm --version
    6.14.7

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

</details>

## Install

    $ git clone https://github.com/Maysaraodeh/dare-node-assessment.git
    $ cd PROJECT_TITLE
    $ npm install

## Configure app

Add new file called `.env` which will contain all the secrets data, your app will not start unless you provide this file config and here is a list of required variables.

```
    INSURANCE_API_CLIENT_ID
    INSURANCE_API_CLIENT_SECRET
    INSURANCE_API_BASE_URL
    JWT_ENCRYPTION
```

Open `./config` then edit it with your env configurations. You will need:

```
    port
    corsConfig
    CORS_ALLOWED_LINK
    JWT_EXPIRATION
```

## Running the project in development

    $ npm run dev

## Running the project in development

    $ npm run prod

## Run Tests

    $ npm run test
