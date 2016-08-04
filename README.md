Lambda UI
==========
An alternative Graphical User Interface for [LambdaCD](https://github.com/flosell/lambdacd).

## Contribute

Thanks for your helping hand!

### Getting Started

#### Compile & Run the Frontend
Use the _go_ script to run the necessary build steps:

1. `./go setup` -- Run to update npm dependencies
2. `./go sass` -- Compiles all sass files to css in watchmode (use goal `sass-once` to compile the files only once.).
3. a) `./go serve-ui` -- Serves the _resources/ui_ folder on port 8080 (Python2 required).

   b) Open _resources/ui/index.html_ in Browser

Also see `./go help` for further goals.
You can also use the NPM targets when inside the _resources/ui_ folder.
