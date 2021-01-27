Backend repository for the [Betalife app](https://betalife-frontend.netlify.app). 

See '__Usage__' for example test on the backend. 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9a016eb72eea47f9a17050dbbbee9520)](https://app.codacy.com/gh/BuildForSDG/team-001-backend?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/team-001-backend&utm_campaign=Badge_Grade_Settings)


## About
This is the backend I created for my team on our Betalife project,
This backend uses __MongoDB__ for database. 
All features can be tested from the frontend, 
[Betalife App](https://betalife-frontend.netlify.app) under the BuildForSDG projects. 
See also __Example__ for testing out the RESTful API 



## Why

Our Betalife project needed a database, Authentication, REST API and other backend features for the Web app. 

## Usage
You can directly test the backend on https://betalife-backend.herokuapp.com

#### Example ####
See a list of all events created from frontend:
https://betalife-backend.herokuapp.com/api/events

Or visit the frontend for 
[Betalife App](https://betalife-frontend.netlify.app) to test out all features. 

## Setup

Install `npm` or `yarn` if you dont have any of them already installed. We recommend Yarn though.

After clonning the repo to your local machine and moving into the cloned folder, Run `yarn install` to get started by installing dependencies. 

`src/index.js` is the entry to the project and source code should go into the `src` folder.

All tests are written in the `__tests__' folder.

This starter uses [Parcel](https://parceljs.org/getting_started.html) as the bundler. It is much simpler than WebPack and the others

#### Hints

- Run `npm install` or `yarn install` to get started. We'll assume you are using Yarn.
- Install additional dependencies: `yarn add <dependency-name> [-D]`
- Run tests: `yarn test`
- Run tests with test coverage info: `yarn test:cover`
- Check the codebase for proper syntax and formatting compliance: `yarn lint`
- Run your app in local dev mode: `yarn start`. This puts the bundled app in a `dist` folder, set up a local web server at localhost:1234, and continues to watch for your code changes which it syncs with the local server. This means if you loaded the app in a browser, it will auto-refresh as you code along. Feel free to use whatever bundler best meets your needs. Parcel was only added as a sample and for those looking for a simple but effective solution to the hassle of bundlers. 

## Authors
See https://betalife-frontend.netlify.app/About for all contributors for the Betalife project 


## Contributing
If this project sounds interesting to you and you'd like to contribute, thank you!
First, you can send a mail to buildforsdg@andela.com to indicate your interest, why you'd like to support and what forms of support you can bring to the table, but here are areas we think we'd need the most help in this project :
The Betalife Project aims to tackle the No Poverty Goal under the UN Sustainable Development Goal. 

## Acknowledgements
A big thanks to Andela BuildForSDG for the for guidance and support. 
Also grateful to the Developers on my team. 

## LICENSE
MIT

