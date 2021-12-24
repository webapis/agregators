
@runner
Feature: Runner

Scenario: 9

User runs tasks successfully
    Given user navigates to task-runner.html page 901
    And component with "#run-tasks-btn" selector is visible to user 902
    When user clicks to button with "#run-tasks-btn" selector 903
    Then component with "#runid-1 > div:nth-child(4) > span" id includes "Pending..." textcontent 904
    And wait for 5 seconds 905
    And component with "#runid-1 > div:nth-child(5) > span" id includes "Ok" textcontent 906
