# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.3.3]

#### Fixed

- Use httpkit 2.2.0 to fix memory leak with websockets (https://github.com/http-kit/http-kit/issues/165)

## [0.3.2]

#### Added

- send credentials on calls to backend so pipelines can use basic-auth

## [0.3.1]

#### Added

- show root level detail link if existing

## [0.3.0]

#### Added
- show build artifacts in build output layer
- follow active step in build details
- add footer with version numbers (can be opted out, see README)
- add grab&scroll info on build details that exceed the monitor width

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

[Unreleased]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.0...HEAD
[0.3.3]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.2...lambdaui-0.3.3
[0.3.2]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.1...lambdaui-0.3.2
[0.3.1]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.0...lambdaui-0.3.1
[0.3.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.2.0...lambdaui-0.3.0
[0.2.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.1...lambdaui-0.2.0
[0.1.1]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.0...lambdaui-0.1.1
