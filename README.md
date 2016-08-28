Lambda UI [![Build Status](https://travis-ci.org/sroidl/lambda-ui.svg?branch=master)](https://travis-ci.org/sroidl/lambda-ui)
==========
An alternative Graphical User Interface for [LambdaCD](https://github.com/flosell/lambdacd).

## Contribute

Thanks for your helping hand!

### Getting Started

#### Development
Use the _go_ script to run the necessary build steps:

1. `./go setup` -- Run to update npm dependencies. Only required once.
2. `./go serve-ui` -- Runs a webserver thats serves the frontend on port 8080. Watches the frontend folder for changes and rebundles them on the fly.
3. `./go serve-backend` -- Runs a webserver that serves the backend-for-frontend with dummy data.

4. `./go push` -- runs `./go test` and `git push` if tests were successful.

##### Directory Structure

* `src/lambdaui` contains the backend code
* `test/lambdaui` contains the backend test

* `resources/ui` contains the frontend code

##### API for Frontend.
To manipulate the dummy data of the backend, edit _dummy_data.clj_ and restart the backend server with `./go serve-backend`.
If you're already familiar with Clojure development, you can also start the server in a REPL and edit the dummy data without restarting.



Also see `./go help` for further goals.
You can also use the NPM targets when inside the _resources/ui_ folder.
