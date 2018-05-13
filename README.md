# Northcoders News API


[Northcoders News](https://tranquil-chamber-17426.herokuapp.com/) is an API for sharing articles online of interest to Northcoders members. NCNews users can read articles; read comments on those articles; search articles by topic, and by individual ID; vote on articles and comments; submit new articles by topic; submit comments to articles; delete comments; and view user profiles. 

## Getting Started

### Prerequisites

Setting up a development and testing environment for NCNews first requires VSCode and MongoDB. You likely have these, but if not, find installation instructions [here](https://code.visualstudio.com/docs) for VSCode and [here](https://docs.mongodb.com/manual/installation/) for MongoDB. 

The Git repository for NCNews can be found [here](https://github.com/TerryDutton/BE-FT-northcoders-news). You will need to set up a GitHub account [here](https://help.github.com/articles/set-up-git/) if you don't already have one, and you must be a member of the [Northcoders team](https://github.com/northcoders) to access the repository. 

### Installation 

Fork the repository and run 
```
$ npm install 
```
at the project's root directory to install dependencies. NCNews uses the following packages: 

Dependencies: 
```
body-parser, ejs, express, mongoose, faker
```
Development Dependencies:
```
chai, mocha, nodemon, supertest
```

NCNews requires config files to operate. Run the command
```
$ npm run createConfig
```
to create a new set of config files.

Finally, open a new instance of your command line and run 
```
$ mongod
```
to start mongoDB, and in your original command line run 
```
$ npm test
```
to ensure everything is working. 

If you want to try running NCNews in your browser, run 
```
$ npm run seed:dev
```
followed by
``` 
$ npm run dev 
```
to activate the server in your local environment. You can then navigate to *localhost:9090* in your preferred web browser to see the homepage and a list of further paths you can try. 

(Note: NCNews cannot function unless MongoDB is active. If you encounter errors, ensure you have an instance of your command line running the 'mongod' command, as described above.)

### Tests

The test file is stored at *./spec/app.spec.js.* For each test, the process seeds a new database called **NCNews_test** (overwriting if it already exists) and saves the initial data to a series of variables. 

```
beforeEach(() => {
    return seedDB(articleData, commentData, topicData, userData)
    .then(docs => [articleDocs, commentDocs, topicDocs, userDocs] = docs);
  });
  after(() => mongoose.disconnect());
```
 
Tests validate by comparing the initial data against the data they receive from querying the NCNews api. 

```
it('returns status 400 and does not post the article if provided a valid Mongo ID that is not a topic ID.', () => {
  const newArticle = {
    title: "Henghis Khan and his Mongo Hoardes", 
    body: "Ask Rory if you're curious",
    created_by: userDocs[0]._id 
  };
  return request.post(`/api/topics/${userDocs[0]._id}/articles`)
  .send(newArticle)
  .expect(400)
  .then(response => {
    const {message} = response.body;
    return Promise.all([Articles.find(), message]);
  })
  .then(([articles, message]) => {
    expect(message).to.equal('Bad request: Invalid topic ID, or article data mising/invalid.');
    expect(articles.length).to.equal(articleDocs.length); 
  });
});
``` 

## Deployment

Deploying this to your own live system requires online hosting. This example uses [mLab](https://mlab.com) to host the database and [Heroku](https://heroku.com) to host the app itself. If you lack accounts for these, you can sign up by following the links. 

Set up a new database on mLabs and set a user for the database. Then copy the command string under the heading "Connect using a driver via the standard MongoDB URI", which should look something like: 
```
mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:12345/<database>
```
In the *production.js* file in the NCNews config folder, insert the command string from mLabs where directed (making sure the quotation marks remain), and replace the \<dbuser\> and \<dbpassword\> in the string with the username and password of the user you set for your database (deleting the triangle-brackets; note also that the username and password is the one you set for the database access and not your actual mLabs login details). Finally, delete the '/\*' and '\*/' characters found at the top and bottom of the file, and save. 

**NOTE:** You should have a file in your project root directory called .gitignore, and it should contain a line with the single word 'config'. If this file is missing, create it with the command 
```
$ touch .gitignore
```
If it does not contain the word 'config', enter it (without the quotation marks) and save. .gitignore prevents its listed files from being pushed to Github when you commit changes; **if it is not set up as described, you run the risk of publically revealing your mLab database login details on GitHub** if you push any changes to your repository. 

Once *production.js* is set up, start mongoDB in a separate command-line instance, then from your initial command line run the command 
```
$ npm run seed:prod
```
to seed your database to mLabs. 

To deploy the app to Heroku, install and set up Heroku on your system and log in with the command 
```
$ heroku login
```
then run the following commands from the root directory of your project: 
```
$ heroku create

$ heroku config:set DB_URI=(Insert here the same mongo string you put into your production.js - do not include the brackets wrapping this sentence)
```
Commit any changes to the code, then run 
```
$ git push heroku master
```
To push your project to Heroku. Finally, run 
```
$ heroku open 
```
to open your newly-hosted and live project in your web browser. 

## Built With: 
[VSCode](https://code.visualstudio.com/) \
[mLabs](https://mlabs.com) \
[Heroku](https://www.heroku.com) 

## Authors
Terry Dutton  \
[Northcoders Team](www.northcoders.com)