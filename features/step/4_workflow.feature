@workflow
Feature: Workflow

Scenario: 5

    User creates task workflows
    
    Given component with "#tasks a[name='Task 1']" selector is visible to user 501
    And user clicks to button with "#tasks a[name='Task 1']" selector 502
    And component with "#add-workflow-btn" selector is visible to user 503
    And user clicks to button with "#add-workflow-btn" selector 504
    And component with "#repos" selector is visible to user 505
    And user selects "books" from "#repos" select tag 506
    And component with "#repobranches" selector is visible to user 507
    And user selects "main" from "#repobranches" select tag 508
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 509
    And button with "#save-workflow-btn" selector is enabled 510
    When user clicks to button with "#save-workflow-btn" selector 511
    Then component with "#workflows" selector is visible to user 512


Scenario: 6

 User updates workflow vars

    Given user clicks to button with "#codergihub_books_main-workflow-config-btn" selector 601
    And component with "#PAGE_URL" selector is visible to user 602
    And user types "https://books.toscrape.com" to input with "#PAGE_URL" selector 603
    When user clicks to button with "#save-vars-btn" selector 604
    Then component with "#workflows" selector is visible to user 605