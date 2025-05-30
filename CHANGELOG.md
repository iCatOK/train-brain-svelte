# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2023-07-12] - Stroop Test Implementation

### Added
- Created new `StroopTest.svelte` component for the Stroop color-word test
- Added `StroopTestResult` interface to the weekly test store
- Implemented methods to save and retrieve Stroop test results

### Changed
- Updated weekly test page to use the new StroopTest component
- Enhanced weekly test flow to include all three tests in sequence
- Added grey background to color cells for better contrast
- Modified reset timer functionality to return to initial state

### Files Modified
- `src/lib/components/weekly-tests/StroopTest.svelte` - Created new component for Stroop test
- `src/lib/stores/weeklyTestResults.ts` - Added Stroop test result handling
- `src/routes/weekly-test/+page.svelte` - Integrated Stroop test into test sequence

### Technical Details
- The Stroop test displays a grid of color words (RED, GREEN, BLUE, YELLOW) in different colors
- Users must name the color of the text, not read the word itself
- Test includes timer functionality with start, reset, and stop controls
- Results are saved to localStorage with timestamp and completion time
- Component follows the same event dispatch pattern as other weekly tests