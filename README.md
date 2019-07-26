# Read Me

todo-vue is a simple todo list app that I created as a vehicle for learning web development technologies.

### client
* Vue application
* Material Design styling provided by Vuetify
* Access control provided by navigation guards in Vue Router
* Deployed in AWS S3
* [/client/README.md](client/README.md)

### server

* Express application
* Authentication provided by Passport
* Supports multiple database types based on environment variable:
  * MongoDB (mlab) via Mongoose
  * DynamoDB
* Deployed as AWS lambda
* [/server/README.md](server/README.md)

:warning: The server will not run without environment variables specified in a .env file

## Project History

### todo-vue (current)

*

### todo-list-4

* website was created with Express generator
* notes and users are stored in mLab database
* authentication performed wtih Passport
* cookies signed and stored on client with cookie-session
* site is hosted on Heroku


### todo-list-3

* index.js: the code that stores/retrieves items is converted into functions
* local-storage.js: the store/retrieve functions are placed in modules
* server.js: the store/retrieve functions are loaded and dynamically injected as strings into io-config.js using the jsToJs package
* index.js: the strings are converted back into the store/retrieve functions using eval()


### todo-list-2

* server.js: Express is used to serve static files


### todo-list-1

* index.html: simple select, button and text area; includes index.js
* index.js: simple todo-list from Eloquent Javascript
* server.js: created in node using http, mime, path, url, and fs packages

