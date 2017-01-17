Lambda UI
==========
__Status:__

[![Build Status](https://travis-ci.org/sroidl/lambda-ui.svg?branch=master)](https://travis-ci.org/sroidl/lambda-ui)[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](http://lambdaui-snapshot.herokuapp.com/lambdaui)

[![Clojars Project](http://clojars.org/lambdaui/latest-version.svg)](http://clojars.org/lambdaui)

LambdaUI is a new User Interface for the build tool [LambdaCD](https://github.com/flosell/lambdacd). It's a SPA based on React/Redux.

See and play with the latest build on [Heroku](http://lambdaui-snapshot.herokuapp.com/lambdaui). Just use the the `Start Build` button and explore all the features.

There is currently no stable version available yet. You might use the current snapshot.

## Features
1. Quick overview of all recent builds:
![Screenshot of build summaries](/screenshots/build-summaries.png)


2. Explore details of your Builds:
![Screenshot of build details](/screenshots/build-details.png)

3. Have a look at your build step output if it's necessary:
![Screenshot of build output](/screenshots/build-output.png)

### Coming up:

#### 0.1.0
* Support main features (at least) as good as the old UI. This includes an overview of all builds, as well as the ability to see details of builds and build step output.

#### 0.2.0
* Websockets! Get your build information asap. Instead of polling the results of a build, the server will push new events to the clients.  
* Support all types of build step results (currently only the output)
* Support of browser history within the app.

Do you have more ideas or feedback?
Open a [feature request](https://github.com/sroidl/lambda-ui/issues/new)!

## Usage
As this project is only the User Interface, you'll need running [LambdaCD](https://github.com/flosell/lambdacd) pipeline. The minimum required version of LambdaCD is currently `0.9.0`. To use LambdaUI, you'll also need to use the [http-kit](http://www.http-kit.org/) (we tested it with v2.1.18) webserver to serve the backend of the UI.

### Step-by-Step setup
We'll suppose you've setup your pipeline as in the [example by LambdaCD](http://www.lambda.cd/getting-started/)

1. In your `project.clj` require _http-kit_ and _lambdaui_:

``` clojure
; ...
:dependencies [ ;...
              [lambdaui "0.1.0-SNAPSHOT"]
              [http-kit "2.1.18"]]
; ...
```

2. In your `core.clj` switch to the new ui:

``` clojure
(ns your.pipeline.core
  (:require [ ; [...]

              ; [lambdacd.ui.ui-server :as ui] -- Replace this by
              [lambdaui.core :as ui]

              ; [ring.server.standalone :as ring-server] -- Replace by
              [org.httpkit.server :as http-kit]
              ; [...]
            ]))

; [...]

(defn -main [args]
  ;[...]

  ; Replace
  ; (ring-server/serve ring-handler {:open-browser? false
  ;                                   :port 8080})
  ; with
  (http-kit/run-server ring-handler { :open-browser? false
                                      :port 8080})
)


```

That's it! Now start the pipeline as usual and have a look the new UI:
`http://localhost:8080/lambdaui`

__Note:__ As there is no feature complete version of the UI right now (Dec 12 2016), the old UI is served as a fallback for your convenience as the default UI at `http://localhost:8080`. This will change with the first stable release.


Also, have a look at the [example-pipeline](https://github.com/sroidl/lambda-ui/tree/master/example-pipeline) for a complete code example.

### Configuration

You can modify your UI by adding an entry to your pipeline config:

``` clojure
; in your -main function:

config {:home-dir home-dir
        :name "some pipeline"   ; Will be used in the UI header.
        :ui-config {            ; Configure the UI here
                    :navbar {
                      :links [ {:url "http://localhost:8080/" :text "Old UI"}]
                    }}

       }
```

#### Supported options

##### __:contextPath__
This option is necessary, if your UI is not served at the root path of your webserver. The easiest way to set this prefix is by passing the `:contextPath` option to the `ui-for` function.

Example:
```clojure

  ;setup webserver routes with compojure
  (def routes (routes
                (context "/my-pipeline" []
                  (ui/ui-for pipeline :contextPath "/my-pipeline"))))

```

##### __:navbar__
Configure the navigation bar (next to the Header) with custom links (see above). `:links` is expected to be a sequence.

`:link`
 A link for the navigation bar in the header can have three keys:
 - `:url`  - relative or absolute URL
 - `:text` - Text shown
 - `:target` (optional, since 0.2.0) - Set the target for the link. Defaults to `_blank` . Change this to `""` if you don't like your links to be opened in a new browser tab.

##### __:showStartBuildButton__ _(experimental)_ - default: `false`
If set to `true`, a button is shown in the Header that allows to trigger a new build. This is only necessary if you don't use a pipeline runner with a waiting trigger step.
__NOTE:__ This feature is experimental and can disappear in any future version.

##### __:show-version__ - default: `false`
If set to `true`  serves another endpoint at `[prefix]/lambdaui/version` and reports the current version of LambdaUI that is used.



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

## License
Copyright (c) 2016 Sebastian Roidl

LambdaUI is distributed under the Apache License 2.0.
