Feature: Task

Scenario: User creates workspace task
    Given user clicks to button with "#local_pub_ws_bdd-link" selector 60
    And user clicks to button with "#tasks-card" selector 61
    And component with "#add-task-btn" selector is visible to user 62     
    And user clicks to button with "#add-task-btn" selector 63
    And component with "#taskname" selector is visible to user 64  
    And user types "Task 1" to input with "#taskname" selector 65
    When user clicks to button with "#save-task-btn" selector 66
    Then component with "#tasks a[name='Task 1']" selector is visible to user 67