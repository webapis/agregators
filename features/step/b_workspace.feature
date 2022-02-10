
Feature: Workspace

Scenario: 1

User creates private workspace

  Given component with "#workspace" selector is visible to user 101
  And user clicks to button with "#workspace" selector 102
  And user clicks to button with "#create-workspace-btn" selector 103
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector 104
  And user types "private" to input with "#accessLevel" selector 105
  And user types "local_ws_bdd_desc" to input with "#description" selector 106
  When user clicks to button with "#save-ws-name-btn" selector 107
  Then component with "#private-tab" selector is visible to user 108
  Then user clicks to button with "#private-tab" selector 109
  Then component with "#local_ws_bdd-ws" selector is visible to user 110
  Then component with "#local_ws_bdd-ws-title" selector is visible to user 111
  Then component with "#local_ws_bdd-ws-description" selector is visible to user 112
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user 113
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user 114



  Scenario: 2

  User creates public workspace
    Given page is navigated to "https://localhost:8888/workspaces-list.html" 213
    And component with "#create-workspace-btn" selector is visible to user 214
    And user clicks to button with "#create-workspace-btn" selector 215
    And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector 216
    And user types "public" to input with "#accessLevel" selector 217
    And user types "local_pub_ws_bdd_desc" to input with "#description" selector 218
    And user clicks to button with "#save-ws-name-btn" selector 219
    When component with "#public-tab" selector is visible to user 220
    Then user clicks to button with "#public-tab" selector 221
    Then component with "#local_pub_ws_bdd-ws" selector is visible to user 222
    Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user 223
    Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user 224
    Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user 225
    Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user 226


 Scenario: 3

 User creates workspace vars
  Given page is navigated to "https://localhost:8888/workspaces-list.html" 301
  And component with "#public-tab" selector is visible to user 302
  And user clicks to button with "#public-tab" selector 303
  And component with "#local_pub_ws_bdd-link" selector is visible to user 304
  And user clicks to button with "#local_pub_ws_bdd-link" selector 305
  And component with "#vars-config-card" selector is visible to user 306
  And user clicks to button with "#vars-config-card" selector 307

  And component with "#repos" selector is visible to user 304
  And user selects "workflow_a_a" from "#repos" select tag 305
  And user types "PAGE_URL" to input with "#var-name-input" selector 306
  And component with "#input-type-selector" selector is visible to user 307
  And user selects "text" from "#input-type-selector" select tag 308
  When user clicks to button with "#add-var-btn" selector 309
  Then component with "#workflow_a_a-tr > td:nth-child(2)" id includes "workflow_a_a" textcontent 310
  And component with "#workflow_a_a-tr > td:nth-child(3)" id includes "PAGE_URL" textcontent 311
  And component with "#workflow_a_a-tr > td:nth-child(4)" id includes "text" textcontent 312

@workspace
  Scenario: 4
User enables google oauth for selected workflow
    Given page is navigated to "https://localhost:8888/workspaces-list.html" 401
    And component with "#public-tab" selector is visible to user 402
    And user clicks to button with "#public-tab" selector 403
    And component with "#local_pub_ws_bdd-link" selector is visible to user 404
    And user clicks to button with "#local_pub_ws_bdd-link" selector 405
    And user navigated to google-oauth-config.html page 406
    And component with "#google-scopes-input" selector is visible to user 407
    And user types "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive" to input with "#google-scopes-input" selector 408
    And user clicks to button with "#save-scopes-btn" selector 409
    And component with "#authenticate-btn" selector is visible to user 410
    And button with "#authenticate-btn" selector is enabled 411
    And user clicks to button with "#authenticate-btn" selector 412
    And component with "#edit-scopes-btn" selector is visible to user 413
    And button with "#edit-scopes-btn" selector is enabled 414


  
  
  