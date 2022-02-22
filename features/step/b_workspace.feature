

Feature: Workspace

Scenario: 1

User creates private workspace

  Given component with "#create-workspace-btn" selector is visible to user 101
  And user clicks to button with "#create-workspace-btn" selector 102
  And user types "local_ws_bdd" to input with "#workspace-name-input" selector 103
  And user types "private" to input with "#accessLevel" selector 104
  And user types "local_ws_bdd_desc" to input with "#description" selector 105
  When user clicks to button with "#save-ws-name-btn" selector 106
  Then component with "#private-tab" selector is visible to user 107
  Then user clicks to button with "#private-tab" selector 108
  Then component with "#local_ws_bdd-ws" selector is visible to user 109
  Then component with "#local_ws_bdd-ws-title" selector is visible to user 110
  Then component with "#local_ws_bdd-ws-description" selector is visible to user 111
  Then component with "#local_ws_bdd-ws-access-level" selector is visible to user 112
  Then component with "#local_ws_bdd-ws-owner" selector is visible to user 113



  Scenario: 2

  User creates public workspace
 
    Given component with "#create-workspace-btn" selector is visible to user 200
    And user clicks to button with "#create-workspace-btn" selector 201
    And user types "local_pub_ws_bdd" to input with "#workspace-name-input" selector 202
    And user types "public" to input with "#accessLevel" selector 203
    And user types "local_pub_ws_bdd_desc" to input with "#description" selector 204
    And user clicks to button with "#save-ws-name-btn" selector 205
    When component with "#public-tab" selector is visible to user 206
    Then user clicks to button with "#public-tab" selector 207
    Then component with "#local_pub_ws_bdd-ws" selector is visible to user 208
    Then component with "#local_pub_ws_bdd-ws-title" selector is visible to user 209
    Then component with "#local_pub_ws_bdd-ws-description" selector is visible to user 210
    Then component with "#local_pub_ws_bdd-ws-access-level" selector is visible to user 211
    Then component with "#local_pub_ws_bdd-ws-owner" selector is visible to user 212

@workspace
 Scenario: 3

 User creates workflow inputs
  Given component with "#public-tab" selector is visible to user 300
  And component with "#public-tab" selector is visible to user 301
  And user clicks to button with "#public-tab" selector 302
  And component with "#local_pub_ws_bdd-link" selector is visible to user 303
  And user clicks to button with "#local_pub_ws_bdd-link" selector 304
  And component with "#vars-config-card" selector is visible to user 305
  And user clicks to button with "#vars-config-card" selector 306
  And component with "#repos" selector is visible to user 307
  And user selects "moda" from "#repos" select tag 308
  And user types "PAGE_URL" to input with "#var-name-input" selector 309
  And component with "#input-type-selector" selector is visible to user 310
  And user selects "text" from "#input-type-selector" select tag 311
  When user clicks to button with "#add-var-btn" selector 312
  Then component with "#moda-tr > td:nth-child(2)" id includes "moda" textcontent 313
  And component with "#moda-tr > td:nth-child(3)" id includes "PAGE_URL" textcontent 314
  And component with "#moda-tr > td:nth-child(4)" id includes "text" textcontent 315


  Scenario: 4
User enables google oauth for selected workflow  

    Given page is navigated to "https://localhost:8888/workspaces-list.html" 401
    And component with "#public-tab" selector is visible to user 402
    And user clicks to button with "#public-tab" selector 403
    And component with "#local_pub_ws_bdd-link" selector is visible to user 404
    And user clicks to button with "#local_pub_ws_bdd-link" selector 405
    And component with "#auth-config-card" selector is visible to user 406
    And user clicks to button with "#auth-config-card" selector 407
    And component with "#google-oauth-config-link" selector is visible to user 410
    And user clicks to button with "#google-oauth-config-link" selector 411
    And component with "#google-scopes-input" selector is visible to user 412
    And user types "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive" to input with "#google-scopes-input" selector 413
    And user clicks to button with "#save-scopes-btn" selector 414
    And component with "#authenticate-btn" selector is visible to user 415
    And button with "#authenticate-btn" selector is enabled 416
    And user clicks to button with "#authenticate-btn" selector 417
    And component with "#edit-scopes-btn" selector is visible to user 418
    And button with "#edit-scopes-btn" selector is enabled 419


  
  
  #Create,Edit,Delete private, public and shared workspace
  #Create, Edit, Delete, workspace vars
  #Create workflow input
  #Navigate to Tasks
  #Enable,Disable Google oauth oauthentication
  #Navigate back using breadcrumb

