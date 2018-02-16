# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

#### Added

- Dark theme!

#### Acknowlegment

Thanks to [@christian-draeger](https://github.com/christian-draeger) for contributing theme support and the dark theme.

## [1.0.0]
(Following semantic versioning this release raises the major version as it contains possible breaking changes).

#### Changes
This release changes the minimum required version of LambdaCD to 0.13.3.

#### Fixed
- Updated all backend dependencies.

#### Acknowledgment
This release contains contribution of [flosell](https://github.com/flosell) and [hackbert](https://github.com/hackbert).
Thank you!


## [0.4.0]

#### Added

- Minimum lambdacd version raised to 0.10.0
- Compatibility with lambdacd 0.13.0

## [0.3.6]

#### Added

- Show absolute step times when hovering build step duration

## [0.3.5]

##### Added

- convert ANSI color codes in shell output to HTML

#### Fixed

- Compatibility with LambdaCD 0.13.0

#### Changed

- Lambda UI now requires at least LambdaCD 0.10.0

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

[Unreleased]: https://github.com/sroidl/lambda-ui/compare/lambdaui-1.0.0...master
[1.0.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.4.0...lambdaui-1.0.0
[0.4.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.6...lambdaui-0.4.0
[0.3.6]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.5...lambdaui-0.3.6
[0.3.5]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.4...lambdaui-0.3.5
[0.3.4]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.3...lambdaui-0.3.4
[0.3.3]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.2...lambdaui-0.3.3
[0.3.2]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.1...lambdaui-0.3.2
[0.3.1]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.3.0...lambdaui-0.3.1
[0.3.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.2.0...lambdaui-0.3.0
[0.2.0]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.1...lambdaui-0.2.0
[0.1.1]: https://github.com/sroidl/lambda-ui/compare/lambdaui-0.1.0...lambdaui-0.1.1
