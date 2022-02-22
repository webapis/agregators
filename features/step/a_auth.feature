@auth
Feature: Authentication


  Scenario: 0
  
  Authentication
    Given component with "#signin" selector is visible to user 1
    And user clicks to button with "#signin" selector 2
    Then component with "#create-workspace-btn" selector is visible to user 3
    And component with "#screenname" selector is visible to user 4

    #signout