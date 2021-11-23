Feature: Task

Scenario: User creates workspace task
    Given user clicks to button with "#local_pub_ws_bdd-link" selector 24
    And user clicks to button with "#tasks-card" selector 25
    And component with "#add-task-btn" selector is visible to user 26     
    And user clicks to button with "#add-task-btn" selector 27
    And component with "#taskname" selector is visible to user 28  
    And user types "Task 1" to input with "#taskname" selector 29
    When user clicks to button with "#save-task-btn" selector 30
    Then component with "#tasks a[name='Task 1']" selector is visible to user 31