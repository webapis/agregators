@workspace
Feature: Workspace

Scenario: 1

User creates private workspace

  Given component with "#workspace" selector is visible to user 201
  And user clicks to button with "#workspace" selector 202
  And user clicks to button with "#create-workspace-btn" selector 203
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector 204
  And user types "private" to input with "#accessLevel" selector 205
  And user types "local_ws_bdd_desc" to input with "#description" selector 206
  When user clicks to button with "#save-ws-name-btn" selector 207
  Then component with "#local_ws_bdd-ws" selector is visible to user 208
  Then component with "#local_ws_bdd-ws-title" selector is visible to user 209
  Then component with "#local_ws_bdd-ws-description" selector is visible to user 210
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user 211
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user 212



  Scenario: 2

  User creates public workspace
    Given component with "#create-workspace-btn" selector is visible to user 213
    And user clicks to button with "#create-workspace-btn" selector 214
    And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector 215
    And user types "public" to input with "#accessLevel" selector 216
    And user types "local_pub_ws_bdd_desc" to input with "#description" selector 217
    And user clicks to button with "#save-ws-name-btn" selector 218
    And component with "#public-tab" selector is visible to user 219
    When user clicks to button with "#public-tab" selector 220
    Then component with "#local_pub_ws_bdd-ws" selector is visible to user 221
    Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user 222
    Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user 223
    Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user 224
    Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user 225