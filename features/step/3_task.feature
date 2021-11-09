Feature: Task

Scenario: User creates workspace task
    Given user clicks to button with "#local_pub_ws_bdd-link" selector
    And user clicks to button with "#tasks-card" selector
    And component with "#add-task-btn" selector is visible to user     
    And user clicks to button with "#add-task-btn" selector
    And component with "#taskname" selector is visible to user  
    And user types "Task 1" to input with "#taskname" selector
    When user clicks to button with "#save-task-btn" selector
    Then component with "#tasks a[name='Task 1']" selector is visible to user