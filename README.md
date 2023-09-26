# Swiftcloud

>
> Written with ❤️ for Taylor Swift Fans
>


#### Requirements

This repo is an implementation of a single flexible HTTP API which respond to Taylor's swift songs queries. The responses could be basic filter based records, comparitive analysis or aggregative analysis based simple stats too.  

This could have been implemented as GET API too, but then there would have been alot of parameters/query strings in the API endpoint itself.  

The choice of POST endpoint, keep the API endpoint cleaner for the client.

## Tech Stack:
- *Node.js* for JS execution environment.
- *JavaScript* for code.
- *ExpressJS* to implement HTTP server.
- *Sqlite3* for in-memory database.
- *AWS API Gateway* to provide an interface for client to call the API.
- *AWS Lambda* for serverless API code execution.

## How to run the server  
>
> 👉 Please make sure that Node.js and NPM are globally installed on your machine.
>

- First clone the repository on your local machine, with below command:
```
git clone https://github.com/ilivestrong/swiftcloud.git
```
- Then change directory to the root repo directory called - `swiftcloud`
- Then to install dependencies, run:
```
>> npm install
``` 
- Once all dependencies get installed successfully, it's time to run the HTTP server, for that run below command:
```
>> node app.js
``` 
>
> 👉 Please make sure that ports `3000` and `3001` are free on your machine. The HTTP server uses 3000 and the integration tests require another 3001. Reason being you want to run the HTTP server and unit tests at same time, so shouldn't crash either of them.  

`If you want to change those ports, you can do that by updatin them in the .env file. But then, make sure that, your Postman requests reference the updated PORT`.
>


## How to run tests
- To run tests, run below command:
```
>> npm run test
``` 


## API Documentation
The documentation has been generated from POSTMAN and is available publicly at below URL with requests and example respones:  
https://documenter.getpostman.com/view/28412434/2s9YJW7Ry5  

Also, POSTMAN requests are also exported as JSON file in the /docs folder in the repo. The collection, once imported can be executed under 2 environments (`Results will be same however``):  

- Local : This requires you to run the local app server first.
- AWS: This will talk to deployed API on AWS using API Gateway.  
***Results will be same however.