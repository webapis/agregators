
@runner
Feature: Runner

Scenario: 15

User runs tasks successfully
    Given component with "#private-tab" selector is visible to user 1500
    And user clicks to button with "#private-tab" selector 1501
    And component with "#local_ws_bdd-tasks" selector is visible to user 1502
    And user clicks to button with "#local_ws_bdd-tasks" selector 1503
    And user clicks to button with "#local_ws_bdd-tasks" selector 1504
    And component with ".accordion-button" selector is visible to user 1505
    And user clicks to button with ".accordion-button" selector 1506
