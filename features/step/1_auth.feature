
Feature: Authentication


  Scenario: User Authentication exists
    Given component with "#signin" selector is visible to user
    When  user clicks to button with "#signin" selector
    Then page is navigated to "https://github.com/login?" url

  Scenario: User Signs in
    Given user types "codergihub" to input with "#login_field" selector
    And user types "password" to input with "#password" selector
    When user clicks to button with ".btn-primary.btn-block.js-sign-in-button" selector
    Then component with "#workspace" selector is visible to user
    And component with "#screenname" selector is visible to user