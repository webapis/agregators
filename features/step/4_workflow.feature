Feature: Workflow

Scenario: User creates task workflows
    Given component with "#tasks a[name='Task 1']" selector is visible to user 32
    And user clicks to button with "#tasks a[name='Task 1']" selector 33
    And component with "#add-workflow-btn" selector is visible to user 34
    And user clicks to button with "#add-workflow-btn" selector 35
    And component with "#repos" selector is visible to user 36
    And user selects "books" from "#repos" select tag 37
    And component with "#repobranches" selector is visible to user 38
    And user selects "main" from "#repobranches" select tag 39
    And component with "#workflowConfig" id includes "google" textcontent 40
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 41
    When user clicks to button with "#save-workflow-btn" selector 42
    Then component with "#workflows" selector is visible to user 43

Scenario: User updates workflow vars
    Given user clicks to button with "#codergihub_books_main-workflow-config-btn" selector 44
    And component with "#PAGE_URL" selector is visible to user 45
    And user types "https://books.toscrape.com" to input with "#PAGE_URL" selector 46
    When user clicks to button with "#save-vars-btn" selector 47
    Then component with "#workflows" selector is visible to user 48