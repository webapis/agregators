
Feature: Authentication


  Scenario: User Authentication exists
    Given component with "#signin" selector is visible to user
    When  user clicks to button with "#signin" selector
    Then page is navigated to "https://github.com/login?" url

  Scenario: User Signs in
    Given component with "#login_field" selector is visible to user
    Given user types "codergihub" to input with "#login_field" selector
    And user types "password" to input with "#password" selector
    And user clicks to button with ".btn-primary.btn-block.js-sign-in-button" selector
    And component with "#js-oauth-authorize-btn" selector is visible to user
    And button with "#js-oauth-authorize-btn" selector is enabled
    When user clicks to button with "#js-oauth-authorize-btn" selector
    Then component with "#workspace" selector is visible to user
    And component with "#screenname" selector is visible to user