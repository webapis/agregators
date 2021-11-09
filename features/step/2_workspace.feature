Feature: Workspace

Scenario: User creates private workspace
  Given user clicks to button with "#workspace" selector
  And user clicks to button with "#create-workspace-btn" selector
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector
  And user types "private" to input with "#accessLevel" selector
  And user types "local_ws_bdd_desc" to input with "#description" selector
  When user clicks to button with "#save-ws-name-btn" selector
  Then component with "#local_ws_bdd-ws" selector is visible to user
  Then component with "#local_ws_bdd-ws-title" selector is visible to user
  Then component with "#local_ws_bdd-ws-description" selector is visible to user
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user

  Scenario: User creates public workspace
  Given user clicks to button with "#create-workspace-btn" selector
  And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector
  And user types "public" to input with "#accessLevel" selector
  And user types "local_pub_ws_bdd_desc" to input with "#description" selector
  And user clicks to button with "#save-ws-name-btn" selector
  And component with "#public-tab" selector is visible to user
  When user clicks to button with "#public-tab" selector
  Then component with "#local_pub_ws_bdd-ws" selector is visible to user
  Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user
  Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user
  Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user
  Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user

