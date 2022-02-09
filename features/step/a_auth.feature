@auth
Feature: Authentication


  Scenario: 0
  
  Authentication
    Given page is navigated to "https://localhost:8888" 1
    And component with "#signin" selector is visible to user 2
    When  user clicks to button with "#signin" selector 3
    And component with "#login_field" selector is visible to user 4
    And user types "codergihub" to input with "#login_field" selector 5
    And user types "password" to input with "#password" selector 6
    And user clicks to button with ".btn-primary.btn-block.js-sign-in-button" selector 7
    Then component with "#workspace" selector is visible to user 8
    And component with "#screenname" selector is visible to user 9