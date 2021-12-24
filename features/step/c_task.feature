
@task
Feature: Task

Scenario: 5
Enable Github workflow
    Given page is navigated to "https://localhost:8888/workspace.html" 501
    And component with "#tasks-card" selector is visible to user 502
    And user clicks to button with "#tasks-card" selector 503
    And user is on page workspace-tasks.html 504
    And component with "#fork-runner-btn" selector is visible to user 505
    And user clicks to button with "#fork-runner-btn" selector 506
    And component with "#enable-workflow-link" selector is visible to user 507
    And user clicks to button with "#enable-workflow-link" selector 508
    And user moves to page workspace-tasks.html tab 509
    And component with "#add-task-btn" selector is visible to user 510
    And component with "#tasks-config-btn" selector is visible to user 511


Scenario: 6
User creates workspace task
    Given component with "#add-task-btn" selector is visible to user 601     
    And user clicks to button with "#add-task-btn" selector 602
    And component with "#taskname" selector is visible to user 603  
    And user types "Task 1" to input with "#taskname" selector 604
    When user clicks to button with "#save-task-btn" selector 605
    Then component with "#tasks a[name='Task 1']" selector is visible to user 606



    



    
    