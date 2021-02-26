# Flight app

A simple project with simple methods

---
## Requirements

For development, you will only need Node.js, a node global package, NPM, and MongoDB installed in your environement.

### Node
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
    v14.15.5

    $ npm --version
    7.5.6

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/vdkkia/flightTest.git
    $ cd flightTest
    $ npm install

## Configure app

Create a `.env` file in the root path then edit it with your settings.
Here is an example:

    serverPort = 5000
    mongoServer = "127.0.0.1:27017" # Replace this with your MongoDB URI if needed
    mongoDatabase = "flightDB"
    mongoTestDatabase = "flightTestDB"
    secret = 'x~hqKH1ZNAAq+Zj'
    sessionSecret = "&W/0#2iZTc?e98D"
    NODE_ENV = "dev"
    redisPort = "6379" # Replace this with your Redis server port if needed
    redisHost = "127.0.0.1" # Replace this with your Redis server address if needed
    redisPassword = "" # There is no password set on Redis by default, you can set it if needed

## Running the project

    $ npm start

## Running the tests

    $ npm test
