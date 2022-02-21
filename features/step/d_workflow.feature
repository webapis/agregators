
@workflow
Feature: Workflow

Scenario: 7

    User creates task workflows
    Given page is navigated to "https://localhost:8888/workspace-tasks.html" 700
    And component with "#tasks a[name='Task 1']" selector is visible to user 701
    And user clicks to button with "#tasks a[name='Task 1']" selector 702
    And component with "#add-workflow-btn" selector is visible to user 703
    And user clicks to button with "#add-workflow-btn" selector 704
    And component with "#repos" selector is visible to user 705
    And user selects "moda" from "#repos" select tag 706
    And component with "#branches" selector is visible to user 707
    And user focuses on component with "#branches" selector 708
    And user selects "main" from "#branches" select tag 709
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 710
    And button with "#save-workflow-btn" selector is enabled 711
    When user clicks to button with "#save-workflow-btn" selector 712
    Then component with "#workflows" selector is visible to user 713


Scenario: 8

 User updates workflow vars

    Given page is navigated to "https://localhost:8888/workflow-configuration.html" 800
    And component with "#PAGE_URL" selector is visible to user 802
    And user types "https://defacto.com" to input with "#PAGE_URL" selector 803
    When user clicks to button with "#save-wf-vars" selector 804
    Then component with "#workflows" selector is visible to user 805


    #create workflow
    #edit workflow
    #delete workflow
    #edit workflow variable
    



    