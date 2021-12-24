@workflow

Feature: Workflow

Scenario: 7

    User creates task workflows
    
    Given component with "#tasks a[name='Task 1']" selector is visible to user 701
    And user clicks to button with "#tasks a[name='Task 1']" selector 702
    And component with "#add-workflow-btn" selector is visible to user 703
    And user clicks to button with "#add-workflow-btn" selector 704
    And component with "#repos" selector is visible to user 705
    And user selects "workflow_a_a" from "#repos" select tag 706
    And component with "#repobranches" selector is visible to user 707
    And user selects "main" from "#repobranches" select tag 708
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 709
    And button with "#save-workflow-btn" selector is enabled 710
    When user clicks to button with "#save-workflow-btn" selector 711
    Then component with "#workflows" selector is visible to user 712


Scenario: 8

 User updates workflow vars

    Given user clicks to button with "#codergihub_workflow_a_a_main-workflow-config-btn" selector 601
    And component with "#PAGE_URL" selector is visible to user 602
    And user types "https://defacto.com" to input with "#PAGE_URL" selector 604
    When user clicks to button with "#save-wf-vars" selector 607
    Then component with "#workflows" selector is visible to user 608



    