Feature: Workspace

Scenario: User creates private workspace
  Given user clicks to button with "#workspace" selector 21
  And user clicks to button with "#create-workspace-btn" selector 22
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector 23
  And user types "private" to input with "#accessLevel" selector 24
  And user types "local_ws_bdd_desc" to input with "#description" selector 25
  When user clicks to button with "#save-ws-name-btn" selector 26
  Then component with "#local_ws_bdd-ws" selector is visible to user 27
  Then component with "#local_ws_bdd-ws-title" selector is visible to user 28
  Then component with "#local_ws_bdd-ws-description" selector is visible to user 29
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user 30
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user 31

  Scenario: User creates public workspace
  Given user clicks to button with "#create-workspace-btn" selector 40
  And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector 41
  And user types "public" to input with "#accessLevel" selector 42
  And user types "local_pub_ws_bdd_desc" to input with "#description" selector 43
  And user clicks to button with "#save-ws-name-btn" selector 44
  And component with "#public-tab" selector is visible to user 45
  When user clicks to button with "#public-tab" selector 46
  Then component with "#local_pub_ws_bdd-ws" selector is visible to user 47
  Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user 48
  Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user 49
  Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user 50
  Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user 51

