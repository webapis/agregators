@workflow
Feature: Workflow

Scenario: 4

    User creates task workflows
    
    Given component with "#tasks a[name='Task 1']" selector is visible to user 401
    And user clicks to button with "#tasks a[name='Task 1']" selector 402
    And component with "#add-workflow-btn" selector is visible to user 403
    And user clicks to button with "#add-workflow-btn" selector 404
    And component with "#repos" selector is visible to user 405
    And user selects "books" from "#repos" select tag 406
    And component with "#repobranches" selector is visible to user 407
    And user selects "main" from "#repobranches" select tag 408
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 409
    And button with "#save-workflow-btn" selector is enabled 410
    When user clicks to button with "#save-workflow-btn" selector 411
    Then component with "#workflows" selector is visible to user 412


Scenario: 5

 User updates workflow vars

    Given user clicks to button with "#codergihub_books_main-workflow-config-btn" selector 413
    And component with "#PAGE_URL" selector is visible to user 414
    And user types "https://books.toscrape.com" to input with "#PAGE_URL" selector 415
    When user clicks to button with "#save-vars-btn" selector 416
    Then component with "#workflows" selector is visible to user 417