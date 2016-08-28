LambdaUI -- Frontend -- Development
===================================

The frontend is served as a single page app, using a ES6 and a React/Redux ecosystem.

# Folder structure

```
 ui/
  README.md
  package.json        -- npm configuration
  webpack.config.js   -- webpack configuration
  js/                 -- source folder of javascript/react components
  sass/               -- source folder of stylefiles
  thirdparty/         -- thirdparty dependencies that are imported by the app.
  public/             -- Folder served as the UI. Main HTML files, bundled JS, compile sass,...

```

# Build targets

To start developing there are several useful npm targets to use:
* `start`  -- starts a webpack-dev-server in watchmode. It serves the UI on port 8080 and will repack the bundle js each time you save a change to one of the files that are used by the modules. The bundle will be held in memory and not saved on the disk.

* `watch:test` -- starts the Jest test runner in watchmode. It is integrated with git and will rerun only those tests that are required to run based on current changes to the git repository. Hint: To have this work properly, commit fast after making changes and having a test for it.

* `test` -- starts the test runner for _all_ tests once.

* `compile` -- compiles the UI into the public folder.
