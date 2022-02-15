
@task
Feature: Task

Scenario: 5
Enable Github workflow
    Given page is navigated to "https://localhost:8888/workspaces-list.html" 500
    And component with "#public-tab" selector is visible to user 501
    And user clicks to button with "#public-tab" selector 502
    And component with "#local_pub_ws_bdd-link" selector is visible to user 503
    And user clicks to button with "#local_pub_ws_bdd-link" selector 504
    And component with "#tasks-card" selector is visible to user 505
    And user clicks to button with "#tasks-card" selector 506
    And component with "#fork-runner-btn" selector is visible to user 507
    And user clicks to button with "#fork-runner-btn" selector 508
    And component with "#enable-workflow-link" selector is visible to user 509
    And a tag with "#enable-workflow-link" selector opens in "_self" target 510
    And component with "#add-task-btn" selector is visible to user 511
    And component with "#tasks-config-btn" selector is visible to user 512


Scenario: 6
User creates workspace task
    Given page is navigated to "https://localhost:8888/workspaces-list.html" 600
    And component with "#public-tab" selector is visible to user 601
    And user clicks to button with "#public-tab" selector 602
    And component with "#local_pub_ws_bdd-link" selector is visible to user 603
    And user clicks to button with "#local_pub_ws_bdd-link" selector 604
    And component with "#tasks-card" selector is visible to user 605
    And user clicks to button with "#tasks-card" selector 606
    And component with "#add-task-btn" selector is visible to user 607
    And user clicks to button with "#add-task-btn" selector 608
    And component with "#taskname" selector is visible to user 609 
    And user types "Task 1" to input with "#taskname" selector 610
    When user clicks to button with "#save-task-btn" selector 611
    Then component with "#tasks a[name='Task 1']" selector is visible to user 612



    



    
    