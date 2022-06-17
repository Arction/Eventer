# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - yyyy-mm-dd
### Added

### Changed

- Upgraded development dependencies

### Deprecated

### Fixed

- Fixed event listener being called immediately when a new listener was attached to topic during event emitting for same topic.
    - This could have easily resulted in an infinite loop being created as new listeners are added to be processed last in the listener order.

### Security

## [1.0.1] - 2019-08-05
### Added
- Changelog

### Changed
- Upgraded dependencies to latest released versions.
- Updated documentation using latest TypeDoc generator.

## [1.0.0] - 2019-07-04
### Added
- Eventer.
