

# Bugs Documentation

## Critical Bugs

1. `updateComponentData` method in `js/general.js` (line 84) is not working
   - Method doesn't update any data
   - Currently only references data without changing it

2. Incorrect array nesting in `js/general.js` (line 7)
   - Key `[['walkway & corridor']]` has unnecessary double array nesting
   - Should be a simple string key

## Minor Bugs

1. Component naming issues in `js/general.js` (lines 69-79)
   - Inconsistent handling of component names
   - Some use direct class names, others use formatted names

2. Missing error handling throughout codebase
   - No try-catch blocks for component access
   - No error handling when elements aren't found
   - Silent failures could crash the app

3. Fixed timeout value in `js/general.js` (line 58)
   - Notification timeout hardcoded to 2000ms
   - Not configurable for different notification types

4. Memory leak risk in `js/general.js` (lines 57-61)
   - `setTimeout` references not properly cleared
   - Could cause memory issues in long sessions

## Code Issues

1. No input validation for:
   - Light intensity values
   - Time format in autoOn/autoOff settings

2. Missing documentation for methods and parameters 
