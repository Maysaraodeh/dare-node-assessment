# Dare Nodejs Assessment

A middleware API that connect clients and admins to an insurance API.

---

## API Docs

A postman collection that you could use, provided with an environment variables and response tests so it makes it easy to fly.

[API Docs](https://documenter.getpostman.com/view/2844109/T1DpDJLp?version=latest)

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

# Dependencies

| Library                                                              |                             Usage                             |
| -------------------------------------------------------------------- | :-----------------------------------------------------------: |
| [express](http://expressjs.com/)                                     |         The core of the app, web framework for Nodejs         |
| [ESM](https://www.npmjs.com/package/esm)                             |       babel-less, bundle-less ECMAScript module loader.       |
| [@hapi/joi](https://www.npmjs.com/package/joi)                       |         Request's body,queries and params validation          |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)           |               Authentication and Authorization                |
| [passport](http://www.passportjs.org/)                               |        Simple, unobtrusive authentication for Node.js         |
| [passport-jwt](http://www.passportjs.org/packages/passport-jwt/)     | A Passport strategy for authenticating with a JSON Web Token. |
| [properties-reader](https://www.npmjs.com/package/properties-reader) |               Properties file reader for nodejs               |
| [request](https://github.com/request/request)                        |                    Simplified HTTP client                     |
| [node-cache](https://www.npmjs.com/package/node-cache)               |      Caching requests data to improve server performance      |
| [lodash](https://lodash.com/)                                        |               Filters,finds and more operations               |
| [moment](https://momentjs.com/)                                      |                      Work with UTC dates                      |
| [morgan](https://github.com/expressjs/morgan)                        |          HTTP request logger middleware for node.js           |
| [nock](https://github.com/nock/nock)                                 |          Mock the external api server to do testing           |
| [supertest](https://github.com/visionmedia/supertest)                |                     Testing app endpoints                     |
| [mocha](https://mochajs.org/)                                        |              A rich JavaScript testing framework              |
| [chai](https://www.chaijs.com)                                       |                   TDD/BDD assertion library                   |
| [http-status-codes](https://www.npmjs.com/package/http-status-codes) |          Constants enumerating the HTTP status codes          |

## Main Points

### Caching

Caching is done using a simple idea that could be described as follows:

the response headers that are coming from the external api, has something called tag with an expiration date for that tag.
Usually, we use the ETAGs in the next request by injecting them in the request headers like IF_NOT_MATCH or IF_NOT_MODIFIED_SINCE.
I used this etag data in another way, i used node-cache library (docs above 👆🏻), the good thing about this library is that you could set a timeout for each key and after this timeout the key will be automatically deleted from the cache, so I did the following :

- the first request for the resources, I make a request for the external api and set my cache data with the response data along with an expiration time equals to the difference between the time now in UTC and the ETAG expiration time in UTC.

- Any new requests to the same resource will be served now from the cache as long as the key exists and not expired.

the advantage of this way is that I can completely stop the requests to the remote API as long as my cache exists, so I don't need to check the external API with the ETAG on each resource request. I've worked with ETAG before but since node-cache, I've stopped dealing with etags, etags save bandwidth but they don't save network requests.

Moreover, express is also sending etags to the end-user (web app, mobile app, ..etc), if the end-user used the etag from express you will get a fantastic result.

let's take an example of an admin user requesting to the clients to retrieve all of them.

- App is hosted on a free heroku instance.
- these result will vary based on the network and the instance, ..etc.
- It's just to show the response's time difference

| Request count | time consumed |
| ------------- | :-----------: |
| Request 1     |     367ms     |
| Request 2     |     80ms      |
| Request 3     |     60ms      |

and it keeps varying between 60ms to 80ms as long as the cache is valid.

### Authorization token renovation or refreshing

As we don't have a refresh token provided by the API we need to test against the API directly, what I did is that:

- i gain an access token as soon as i get a request (first request from any client).
- this token will be saved in the cache but with no expiration as we also don't have details about the expiration time (expires_in) field,
- Next, on each request i receive i use the local cached token, if the an error related to the token expiration or any token issues has been thrown, i regain the token from the api and repeat the previous request.

the advantage for this approach is not very clear especially if the token expires in seconds, but you don't need to always get the token first and then send the request, with this approach you may save a little bit of bandwidth and network requests.

## Install

    $ git clone https://github.com/Maysaraodeh/dare-node-assessment.git
    $ cd dare-node-assessment
    $ npm install

## Configure app

Add new file called `.env` which will contain all the your secrets data, your app will not start properly unless you provide this file config and here is a list of required variables.

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

## Run Tests

    $ npm run test
