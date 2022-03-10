

Feature: Workflow

Scenario: 12

    User creates task workflows
    Given component with "#private-tab" selector is visible to user 1201
    And user clicks to button with "#private-tab" selector 1202
    And component with "#local_ws_bdd-tasks" selector is visible to user 1203
    And user clicks to button with "#local_ws_bdd-tasks" selector 1204
    And component with ".accordion-button" selector is visible to user 1205
    And user clicks to button with ".accordion-button" selector 1206
    And component with "button[id^='add-workflow-btn-']" selector is visible to user 1207
    And user clicks to button with "button[id^='add-workflow-btn-']" selector 1208
    And component with "#repos" selector is visible to user 1209
    And user focuses on component with "#repos" selector 1210
    And user selects "workflow_a_a" from "#repos" select tag 1211
    And component with "#branches" selector is visible to user 1212
    And user focuses on component with "#branches" selector 1213
    And user selects "main" from "#branches" select tag 1214
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 1215
    And button with "#save-workflow-btn" selector is enabled 1216
    When user clicks to button with "#save-workflow-btn" selector 1217
    Then component with ".accordion-button" selector is visible to user 1218
    And user clicks to button with ".accordion-button" selector 1219
    And component with "div[id$='-wf']" id includes "local_wf_bdd_desc" textcontent 1220
    And component with "div[id$='-wf']" id includes "main" textcontent 1221
    And component with "div[id$='-wf']" id includes "workflow_a_a" textcontent 1222


Scenario: 13

 User Edit task workflow

    Given component with "#private-tab" selector is visible to user 1300
    And user clicks to button with "#private-tab" selector 1301
    And component with "#local_ws_bdd-tasks" selector is visible to user 1302
    And user clicks to button with "#local_ws_bdd-tasks" selector 1303
    And component with ".accordion-button" selector is visible to user 1304
    And user clicks to button with ".accordion-button" selector 1305
    And component with "button[id$='-workflow-editor-btn']" selector is visible to user 1306
    And user clicks to button with "button[id$='-workflow-editor-btn']" selector 1307
    And component with "#workflowDescriptionTextarea" selector is visible to user 1308
    And clear input with "#workflowDescriptionTextarea" id 1309
    And user types "local_wf_bdd_desc_updated" to input with "#workflowDescriptionTextarea" selector 1310
    And user clicks to button with "#save-workflow-btn" selector 1311
    And component with ".accordion-button" selector is visible to user 1312
    And user clicks to button with ".accordion-button" selector 1313
    And component with "div[id$='-wf']" id includes "local_wf_bdd_desc_updated" textcontent 1314
    And component with "div[id$='-wf']" id includes "main" textcontent 1315
    And component with "div[id$='-wf']" id includes "workflow_a_a" textcontent 1316
    
@workflow
Scenario: 14

 User updates workflow vars

    Given component with "#private-tab" selector is visible to user 1400
    And user clicks to button with "#private-tab" selector 1401
    And component with "#local_ws_bdd-tasks" selector is visible to user 1402
    And user clicks to button with "#local_ws_bdd-tasks" selector 1403
    And component with ".accordion-button" selector is visible to user 1404
    And user clicks to button with ".accordion-button" selector 1405
    And component with "button[id$='-workflow-config-btn']" selector is visible to user 1406
    And user clicks to button with "button[id$='-workflow-config-btn']" selector 1407
    And component with "#save-wf-vars" selector is visible to user 1408
    And user clicks to button with "#save-wf-vars" selector 1409



    #create workflow
    #edit workflow
    #delete workflow
    #edit workflow variable
    



    