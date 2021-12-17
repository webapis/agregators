
@task
Feature: Task

Scenario: 3
Enable Github workflow
    Given component with "#local_pub_ws_bdd-link" selector is visible to user 301
    And user clicks to button with "#local_pub_ws_bdd-link" selector 302
    And component with "#tasks-card" selector is visible to user 303
    And user clicks to button with "#tasks-card" selector 304
    Given user is on page workspace-tasks.html 305
    And component with "#fork-runner-btn" selector is visible to user 306
    And user clicks to button with "#fork-runner-btn" selector 307
    And component with "#enable-workflow-link" selector is visible to user 308
    And user clicks to button with "#enable-workflow-link" selector 309
    And user moves to page workspace-tasks.html tab 310
    And component with "#add-task-btn" selector is visible to user 311
    And component with "#tasks-config-btn" selector is visible to user 312


Scenario: 4
User creates workspace task
    Given component with "#add-task-btn" selector is visible to user 401     
    And user clicks to button with "#add-task-btn" selector 402
    And component with "#taskname" selector is visible to user 403  
    And user types "Task 1" to input with "#taskname" selector 404
    When user clicks to button with "#save-task-btn" selector 405
    Then component with "#tasks a[name='Task 1']" selector is visible to user 406



    



    
    