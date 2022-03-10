
@task
Feature: Task

Scenario: 9

Enable Github workflow. Scenario order 9 could change if previous number of scenarious increase.

  
    Given component with "#private-tab" selector is visible to user 901
    And user clicks to button with "#private-tab" selector 902
    And component with "#local_ws_bdd-tasks" selector is visible to user 903
    And user clicks to button with "#local_ws_bdd-tasks" selector 904
    And component with "#fork-runner-btn" selector is visible to user 905
    And user clicks to button with "#fork-runner-btn" selector 906
    And component with "#enable-workflow-link" selector is visible to user 907
    And a tag with "#enable-workflow-link" selector opens in "_self" target 908
    And component with "#task-editor-btn" selector is visible to user 909
  


Scenario: 10
User creates workspace task

    Given component with "#private-tab" selector is visible to user 1001
    And user clicks to button with "#private-tab" selector 1002
    And component with "#local_ws_bdd-tasks" selector is visible to user 1003
    And user clicks to button with "#local_ws_bdd-tasks" selector 1004
    And component with "#task-editor-btn" selector is visible to user 1005
    And user clicks to button with "#task-editor-btn" selector 1006
    And component with "#taskname" selector is visible to user 1007
    And user types "Task 1" to input with "#taskname" selector 1008
    When user clicks to button with "#save-task-btn" selector 1009
    And component with "#tasks" selector contains 1 children 1010



Scenario: 11
User edit workspace task
    
    Given component with "#private-tab" selector is visible to user 1101
    And user clicks to button with "#private-tab" selector 1102
    And component with "#local_ws_bdd-tasks" selector is visible to user 1103
    And user clicks to button with "#local_ws_bdd-tasks" selector 1104
    And component with ".accordion-button" selector is visible to user 1105
    And user clicks to button with ".accordion-button" selector 1106
    And component with "edit-task-btn[id$='-task-editable-btn']" selector is visible to user 1107
    And user clicks to button with "edit-task-btn[id$='-task-editable-btn']" selector 1108
    And clear input with "input[id$='-title']" id 1109
    And user types "Task One updated" to input with "input[id$='-title']" selector 1110
    And clear input with "input[id$='-order']" id 1111
    And user types "2" to input with "input[id$='-order']" selector 1112
    And component with "select[id$='-sequence']" selector is visible to user 1113
    And user selects "parallel" from "[id$='-sequence']" select tag 1114
    And component with "#tasks" selector contains 1 children 1115
    When user clicks to button with "edit-task-btn[id$='-task-editable-btn']" selector 1116
    Then component with "[id$='-sequence']" selector is disabled 1117
    And input with "input[id$='-order']" selector is readonly 1118
    And input with "input[id$='-title']" selector is readonly 1119
    And user reloads page 1120
    And user clicks to button with ".accordion-button" selector 1121
    And input with "[id$='-order']" id includes "2" value 1122
    And input with "[id$='-title']" id includes "Task One updated" value 1123
    And selected value for "[id$='-sequence']" selector is "parallel" 1124

#create task
#edit Task
#delete task
#edit task order
#edit task sequence


#run task
#abort task
#task logs
#edit task vars


    
    