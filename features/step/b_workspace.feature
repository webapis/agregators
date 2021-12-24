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


 Scenario: 3

 User creates workspace vars
  Given user clicks to button with "#local_pub_ws_bdd-link" selector 301
  And component with "#vars-config-card" selector is visible to user 302
  And user clicks to button with "#vars-config-card" selector 303
  And component with "#repos" selector is visible to user 304
  And user selects "workflow_a_a" from "#repos" select tag 305
  And user types "PAGE_URL" to input with "#var-name-input" selector 306
  And component with "#input-type-selector" selector is visible to user 307
  And user selects "text" from "#input-type-selector" select tag 308
  When user clicks to button with "#add-var-btn" selector 309
  Then component with "#workflow_a_a-tr > td:nth-child(2)" id includes "workflow_a_a" textcontent 310
  And component with "#workflow_a_a-tr > td:nth-child(3)" id includes "PAGE_URL" textcontent 311
  And component with "#workflow_a_a-tr > td:nth-child(4)" id includes "text" textcontent 312


  Scenario: 4
User enables google oauth for selected workflow

    Given user navigated to google-oauth-config.html page 401
    And component with "#google-scopes-input" selector is visible to user 402
    And user types "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive" to input with "#google-scopes-input" selector 403
    And user clicks to button with "#save-scopes-btn" selector 404
    And button with "#authenticate-btn" selector is enabled 405
    When user clicks to button with "#authenticate-btn" selector 406
    Then button with "#authenticate-btn" selector is disabled 407


  
  
  