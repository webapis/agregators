@auth
Feature: Authentication


  Scenario: 0
  
  Authentication
    Given page is navigated to "https://localhost:8888" 1
    And component with "#signin" selector is visible to user 2
    When  user clicks to button with "#signin" selector 3
    Then component with "#workspace" selector is visible to user 4
    And component with "#screenname" selector is visible to user 5