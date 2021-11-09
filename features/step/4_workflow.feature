Feature: Workflow

Scenario: User creates task workflows
Given component with "#tasks a[name='Task 1']" selector is visible to user
And user clicks to button with "#tasks a[name='Task 1']" selector
And component with "#add-workflow-btn" selector is visible to user
And user clicks to button with "#add-workflow-btn" selector
And component with "#repos" selector is visible to user
And user selects "books" from "#repos" select tag
And user selects "main" from "#repobranches" select tag
And user types "local_wf_bdd_desc" to input with "#workflowDescriptionTextarea" selector
