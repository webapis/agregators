
@task
Feature: Task

Scenario: 3
Enable Github workflow
    Given user goes to page workspace-tasks.html 301
    And component with "#fork-runner-btn" selector is visible to user 302
    And user clicks to button with "#fork-runner-btn" selector 303
    And component with "#enable-workflow-link" selector is visible to user 304
    And user clicks to button with "#enable-workflow-link" selector 305
    And user moves to page workspace-tasks.html tab 306
    And component with "#add-task-btn" selector is visible to user 307
    And component with "#run-tasks-btn" selector is visible to user 308
    And component with "#tasks-config-btn" selector is visible to user 309


Scenario: 4
User creates workspace task
    Given component with "#add-task-btn" selector is visible to user 404     
    And user clicks to button with "#add-task-btn" selector 405
    And component with "#taskname" selector is visible to user 406  
    And user types "Task 1" to input with "#taskname" selector 407
    When user clicks to button with "#save-task-btn" selector 408
    Then component with "#tasks a[name='Task 1']" selector is visible to user 409

    