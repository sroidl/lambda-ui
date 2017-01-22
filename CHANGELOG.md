# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

#### Added
- follow active step in build details

## [0.2.0]

#### Added
- `:show-version` config item.
- Tooltip showing the absolute start time in build summaries
- `:target` option in navbar links of config. 
- opens most interesting step (waiting / running / failure) when opening a build for the first time
- expand all steps / collapse all steps
- include build step state in output layer

#### Fixed 
- trigger time is now excluded from the build started calculation
- interaction with backend (trigger steps, etc.) now also work in safari (and probably IE too)
- horizontal drag & scroll also works in the whole build details area 
- horizontal drag & scroll does not close/open build steps anymore


## [0.1.1]

#### Fixed
- Also show pipelines in 'unknown' state
- Fix scroll by drag bug
- Do not include trigger waiting time in duration calculation of build summaries

## 0.1.0
First release.

[Unreleased]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.2.0...HEAD
[0.2.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.1...lambdaui-0.2.0
[0.1.1]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.0...lambdaui-0.1.1
