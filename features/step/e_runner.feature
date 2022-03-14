
@runner
Feature: Runner

Scenario: 15

User runs tasks successfully
    Given component with "#private-tab" selector is visible to user 1500
    And user clicks to button with "#private-tab" selector 1501
    And component with "#local_ws_bdd-tasks" selector is visible to user 1502
    And user clicks to button with "#local_ws_bdd-tasks" selector 1503
    And component with ".accordion-button" selector is visible to user 1504
    And user clicks to button with ".accordion-button" selector 1505
    And component with "#run-all-tasks-btn" selector is visible to user 1506
    When user clicks to button with "#run-all-tasks-btn" selector 1507
    Then component with "#spinner-local_ws_bdd" selector is visible to user 1508
    And component with "#local_ws_bdd-totalTasks" id includes "1" textcontent 1509
    And component with "#local_ws_bdd-totalWorkflows" id includes "0/1" textcontent 1510
    And component with "#local_ws_bdd-totalWorkflows" id includes "1/1" textcontent 1511
    And component with "#local_ws_bdd-totalWorkflows" id includes "1/1" textcontent 1512
