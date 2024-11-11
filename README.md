# Installation

## npm

`npm install -g npm`

## jest-cli

`npm install --save-dev jest`

## babel

`npm install --save-dev babel-jest @babel/core @babel/preset-env babel`

# Unit Testing

## To perform Unit Testing, first:

`cd jest-test`, then run:

`npm test`

OR

`npx jest test_script.test.js`

## Unit Tests Covered:

1. addTaskToDOM adds a task to the DOM
2. saveTaskToLocalStorage saves a task
3. removeTaskFromLocalStorage removes a task
4. loadTasks loads tasks from local storage
5. add-task button triggers adding a task
6. add-task button does not add a task if input is empty
7. removeTaskFromLocalStorage does nothing if task is not found
8. loadTasks handles empty local storage gracefully
9. integration: adding and removing tasks updates local storage and DOM
10. add-task button does not add task if input is empty
11. loadTasks restores DOM state after multiple operations
12. setupEventListeners binds events correctly

# Integration Testing

## To perform Integration Testing, first:

`cd integration-test`, then run:

`python3 integration_test.py`

**Note:** You may have to run `pip install selenium` first.
