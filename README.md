## mitoc-gear.mit.edu

This repository contains the source code of the UI for https://mitoc-gear.mit.edu, the interface to the gear database of the [MIT Outing Club](https://mitoc.mit.edu/). 

It is written using React and Typescript. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Prerequisites

To run this app locally, you need to:
- Have Node.js v24 installed
- After installing Node.js v24, install `yarn` via `npm install --global yarn`
- Have a local version of the gear database backend API running on http://localhost:8000. This backend code lives (for now) in a [separate private repository](https://github.com/mitoc/gear-db-django).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
