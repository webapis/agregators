Feature: Workspace

Scenario: User creates workspace
  Given user clicks to button with "#workspace" selector
  And user clicks to button with "#create-workspace-btn" selector
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector
  And user types "private" to input with "#accessLevel" selector
  And user types "local_ws_bdd_desc" to input with "#description" selector
  When user clicks to button with "#save-ws-name-btn" selector
  