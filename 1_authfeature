
Feature: Authentication


  Scenario: User Authentication exists
    Given component with "#signin" selector is visible to user 1
    When  user clicks to button with "#signin" selector 2
    Then page is navigated to "https://github.com/login?" url 3

  Scenario: User Signs in
    Given component with "#login_field" selector is visible to user 4
    Given user types "codergihub" to input with "#login_field" selector 5
    And user types "password" to input with "#password" selector 6
    And user clicks to button with ".btn-primary.btn-block.js-sign-in-button" selector 7
    Then component with "#workspace" selector is visible to user 8
    And component with "#screenname" selector is visible to user 9