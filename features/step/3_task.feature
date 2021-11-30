@task
Feature: Task

Scenario: 3

User creates workspace task
    Given component with "#local_pub_ws_bdd-link" selector is visible to user 301
    And user clicks to button with "#local_pub_ws_bdd-link" selector 302
    And user clicks to button with "#tasks-card" selector 303
    And component with "#add-task-btn" selector is visible to user 304     
    And user clicks to button with "#add-task-btn" selector 305
    And component with "#taskname" selector is visible to user 306  
    And user types "Task 1" to input with "#taskname" selector 307
    When user clicks to button with "#save-task-btn" selector 308
    Then component with "#tasks a[name='Task 1']" selector is visible to user 309