Lambda UI [![Build Status](https://travis-ci.org/sroidl/lambda-ui.svg?branch=master)](https://travis-ci.org/sroidl/lambda-ui)[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](http://lambdaui-snapshot.herokuapp.com/lambdaui)
==========
[![Clojars Project](http://clojars.org/lambdaui/latest-version.svg)](http://clojars.org/lambdaui)

An alternative Graphical User Interface for [LambdaCD](https://github.com/flosell/lambdacd).

See and play with the latest build on [Heroku](http://lambdaui-snapshot.herokuapp.com/lambdaui)

## Contribute

Thanks for your helping hand!

### Getting Started

#### Development
Use the _go_ script to run the necessary build steps:

1. `./go setup` -- Run to update npm dependencies. Only required once.
2. `./go serve-ui` -- Runs a webserver thats serves the frontend on port 8080. Watches the frontend folder for changes and rebundles them on the fly.
3. `./go serve-backend` -- Runs a webserver that serves the backend-for-frontend with dummy data.
4. `./go push` -- runs `./go test` and `git push` if tests were successful.

5. `./go jar` -- Compiles the project and packs everything into the current jar of lambdaui. Those are located in `backend/target/lambdaui-{version}-[qualifier].jar` (e.g. _backend/target/lambdaui-0.1.0-SNAPSHOT_)

##### Directory Structure

* `backend` contains the clojure project that's being published as a plugin to LambdaCD
* `frontend` contains the JS based UI part of the Plugin.

##### API for Frontend.
To manipulate the dummy data of the backend, edit _dummy_data.clj_ and restart the backend server with `./go serve-backend`.
If you're already familiar with Clojure development, you can also start the server in a REPL and edit the dummy data without restarting.



Also see `./go help` for further goals.
You can also use the NPM targets when inside the _resources/ui_ folder.

## Acknowledgements
Many thanks to __JetBrains__ for providing our project with free open source licences for their excellent products to use during the development of LambdaUI!
