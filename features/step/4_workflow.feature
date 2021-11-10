Feature: Workflow

Scenario: User creates task workflows
    Given component with "#tasks a[name='Task 1']" selector is visible to user
    And user clicks to button with "#tasks a[name='Task 1']" selector
    And component with "#add-workflow-btn" selector is visible to user
    And user clicks to button with "#add-workflow-btn" selector
    And component with "#repos" selector is visible to user
    And user selects "books" from "#repos" select tag
    And component with "#repobranches" selector is visible to user
    And user selects "main" from "#repobranches" select tag
    And component with "#workflowConfig" id includes "google" textcontent
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector
    When user clicks to button with "#save-workflow-btn" selector
    Then component with "#workflows" selector is visible to user

Scenario: User updates workflow vars
    Given user clicks to button with "#codergihub_books_main-workflow-config-btn" selector
    And component with "#PAGE_URL" selector is visible to user
    And user types "https://books.toscrape.com" to input with "#PAGE_URL" selector
    When user clicks to button with "#save-vars-btn" selector  
    Then component with "#workflows" selector is visible to user