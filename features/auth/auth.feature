Feature: User Authentication
 

  Scenario: User Authentication exists
    Given Users sees Sign in button
    When User clicks on Sign in button
    Then User is navigated to github auth page
  @signin
  Scenario: User Authenticates with github
    Given user enters correct username and password
    And user clicks Github Sign in button
    Then Workspace button is visible to the user
    Then Username is displayed at the top

