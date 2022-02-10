

Feature: Workflow
@workflow
Scenario: 7

    User creates task workflows
    Given page is navigated to "https://localhost:8888/workspaces-list.html" 700
    And component with "#public-tab" selector is visible to user 701
    And user clicks to button with "#public-tab" selector 702
    And component with "#local_pub_ws_bdd-link" selector is visible to user 703
    And user clicks to button with "#local_pub_ws_bdd-link" selector 704
    And component with "#tasks-card" selector is visible to user 705
    And user clicks to button with "#tasks-card" selector 706
    And component with "#tasks a[name='Task 1']" selector is visible to user 707
    And user clicks to button with "#tasks a[name='Task 1']" selector 708
    And component with "#add-workflow-btn" selector is visible to user 709
    And user clicks to button with "#add-workflow-btn" selector 710
    And component with "#repos" selector is visible to user 711
    And user selects "workflow_a_a" from "#repos" select tag 712
    And component with "#repobranches" selector is visible to user 713
    And user selects "main" from "#repobranches" select tag 714
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 715
    And button with "#save-workflow-btn" selector is enabled 716
    When user clicks to button with "#save-workflow-btn" selector 717
    Then component with "#workflows" selector is visible to user 718


Scenario: 8

 User updates workflow vars

    Given user clicks to button with "#codergihub_workflow_a_a_main-workflow-config-btn" selector 801
    And component with "#PAGE_URL" selector is visible to user 802
    And user types "https://defacto.com" to input with "#PAGE_URL" selector 803
    When user clicks to button with "#save-wf-vars" selector 804
    Then component with "#workflows" selector is visible to user 805



    