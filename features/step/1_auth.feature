
@auth
Feature: Authentication


  Scenario: User Authentication exists
    Given component with "#signin" selector is visible to user 1
    When  user clicks to button with "#signin" selector 2
    Then component with "#workspace" selector is visible to user 3

