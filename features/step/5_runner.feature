
@runner
Feature: Runner

Scenario: 8

User runs tasks successfully
    Given user navigates to workspaces-list.html page 801
    And component with "#local_pub_ws_bdd-link" selector is visible to user 802
    And user clicks to button with "#local_pub_ws_bdd-link" selector 803
    And user clicks to button with "#task-runner-card" selector 804
    And component with "#run-tasks-btn" selector is visible to user 805
    When user clicks to button with "#run-tasks-btn" selector 806
    Then component with "#runid-1 > div:nth-child(4) > span" id includes "Pending..." textcontent 807
    And component with "#runid-1 > div:nth-child(5) > span" id includes "Ok" textcontent 808
