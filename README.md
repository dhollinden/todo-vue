# Read Me

todo-vue is a simple todo list app that I'm using as a vehicle for learning web development technologies.

### client
* Vue application with Vuetify and Vue Router
* Deployed in AWS S3
* [/client/README.md](client/README.md)

### server

* Express application with Passport for authentication
* Supports both MongoDB (mlab) and DynamoDB databases
* Deployed as AWS lambda using Serverless
* [/server/README.md](server/README.md)

:warning: The server will not run without environment variables specified in a .env file

## Project History

### todo-vue (current)

* convert existing Express app into back end API
* use vue-cli to create Vue front end with Webpack
* use axios to place API calls to back end
* use Bootstrap for styling initially, then convert to Material Design via Vuetify
* create persistent navigation bar with navigation drawer for mobile
* control access using navigation guards in Vue Router
* host front end on AWS S3 and distribute with Cloudfront CDN
* deploy Express API on AWS using Serverless

### todo-list-4

* use Express generator to create app
* create database layer that supports both MongoDB (mLab) and DynamoDB databases
* use pug view engine
* use Passport for authentication
* use express-validator package for validation and sanitization
* use cookie-session package to sign and store cookies on client
* deploy on Heroku


### todo-list-3

* the code for storing/retrieving items is converted into functions and placed in modules
* the store/retrieve functions are loaded and dynamically injected as strings into io-config.js using the jsToJs package
* the strings are converted back into the store/retrieve functions using eval()


### todo-list-2

* convert to Express app


### todo-list-1

Barebones note-taking app

* create server in node using http, mime, path, url, and fs modules
* create app based on example in [Eloquent Javascript](https://eloquentjavascript.net/18_http.html#h_xMhbz7W4BY)


