# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2023-07-14] - Day Counter UI Enhancement

### Added
- Extended day counter text to be more descriptive: "Day X of your math journey"

### Changed
- Moved day counter from top-right corner to under the title and subtitle on the home page
- Redesigned day counter with a simpler, centered style
- Fixed date initialization issue in dayCounter.ts

### Files Modified
- `src/lib/stores/dayCounter.ts` - Fixed date initialization error and extended counter text
- `src/routes/+page.svelte` - Repositioned and restyled day counter

### Technical Details
- Improved error handling for date initialization
- Enhanced visual hierarchy with day counter positioned below the hero section
- Simplified design with centered text and rounded corners