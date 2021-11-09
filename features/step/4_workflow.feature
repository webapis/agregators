Feature: Workflow

Scenario: User creates task workflows
Given component with "#tasks a[name='Task 1']" selector is visible to user
And user clicks to button with "#tasks a[name='Task 1']" selector
And component with "#add-workflow-btn" selector is visible to user
And user clicks to button with "#add-workflow-btn" selector
And component with "#repoDataList" selector is visible to user
And user focuses on component with "#repoDataList" selector
