Feature: Workflow

Scenario: User creates task workflows
    Given component with "#tasks a[name='Task 1']" selector is visible to user 70
    And user clicks to button with "#tasks a[name='Task 1']" selector 71
    And component with "#add-workflow-btn" selector is visible to user 72
    And user clicks to button with "#add-workflow-btn" selector 73
    And component with "#repos" selector is visible to user 74
    And user selects "books" from "#repos" select tag 75
    And component with "#repobranches" selector is visible to user 76
    And user selects "main" from "#repobranches" select tag 77
    And component with "#workflowConfig" id includes "google" textcontent 78
    And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector 79
    When user clicks to button with "#save-workflow-btn" selector 80
    Then component with "#workflows" selector is visible to user 81

Scenario: User updates workflow vars
    Given user clicks to button with "#codergihub_books_main-workflow-config-btn" selector 82
    And component with "#PAGE_URL" selector is visible to user 83
    And user types "https://books.toscrape.com" to input with "#PAGE_URL" selector 84
    When user clicks to button with "#save-vars-btn" selector 85
    Then component with "#workflows" selector is visible to user 86