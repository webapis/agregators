Feature: Workspace

Scenario: User creates private workspace
  Given user clicks to button with "#workspace" selector 1
  And user clicks to button with "#create-workspace-btn" selector 2
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector 3
  And user types "private" to input with "#accessLevel" selector 4
  And user types "local_ws_bdd_desc" to input with "#description" selector 5
  When user clicks to button with "#save-ws-name-btn" selector 6
  Then component with "#local_ws_bdd-ws" selector is visible to user 7
  Then component with "#local_ws_bdd-ws-title" selector is visible to user 8
  Then component with "#local_ws_bdd-ws-description" selector is visible to user 9
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user 10
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user 11

  Scenario: User creates public workspace
  Given user clicks to button with "#create-workspace-btn" selector 12
  And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector 13
  And user types "public" to input with "#accessLevel" selector 14
  And user types "local_pub_ws_bdd_desc" to input with "#description" selector 15
  And user clicks to button with "#save-ws-name-btn" selector 16
  And component with "#public-tab" selector is visible to user 17
  When user clicks to button with "#public-tab" selector 18
  Then component with "#local_pub_ws_bdd-ws" selector is visible to user 19
  Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user 20
  Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user 21
  Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user 22
  Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user 23

