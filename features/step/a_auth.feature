@auth
Feature: Authentication


  Scenario: 0
  
  Authentication

    Given component with "#signin" selector is visible to user 1
    When  user clicks to button with "#signin" selector 2
    And component with "#login_field" selector is visible to user 3
    And user types "codergihub" to input with "#login_field" selector 4
    And user types "password" to input with "#password" selector 5
    And user clicks to button with ".btn-primary.btn-block.js-sign-in-button" selector 6
    Then component with "#workspace" selector is visible to user 7
    And component with "#screenname" selector is visible to user 8