


@workspace
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


Scenario: 3
User edits public workspace description
  Given component with "#public-tab" selector is visible to user 300
  And user clicks to button with "#public-tab" selector 301
  And component with "#local_pub_ws_bdd-ws" selector is visible to user 302
  And component with "#local_pub_ws_bdd-edit" selector is visible to user 303
  And user clicks to button with "#local_pub_ws_bdd-edit" selector 304
  And component with "#description" selector is visible to user 305
  And user types "updated_" to input with "#description" selector 306
  When user clicks to button with "#save-ws-name-btn" selector 307
  Then component with "#public-tab" selector is visible to user 308
  And component with "#local_pub_ws_bdd-ws-description" selector is visible to user 309
  And component with "#local_pub_ws_bdd-ws-description" id includes "updated_local_pub_ws_bdd_desc" textcontent 310
 


Scenario: 4
User changes public workspace to private
  Given component with "#public-tab" selector is visible to user 400
  And user clicks to button with "#public-tab" selector 401
  And component with "#local_pub_ws_bdd-ws" selector is visible to user 402
  And component with "#local_pub_ws_bdd-edit" selector is visible to user 403
  And user clicks to button with "#local_pub_ws_bdd-edit" selector 404
  And component with "#accessLevel" selector is visible to user 405
  And user selects "private" from "#accessLevel" select tag 406
  When user clicks to button with "#save-ws-name-btn" selector 407
  Then component with "#private-tab" selector is visible to user 408
  And user clicks to button with "#private-tab" selector 409
  And component with "#local_pub_ws_bdd-ws" selector is visible to user 410

Scenario: 5
User deletes private workspace
  Given component with "#private-tab" selector is visible to user 500
  And user clicks to button with "#private-tab" selector 501
  And component with "#workspaces" selector contains 2 children 502
  And component with "#local_pub_ws_bdd-delete" selector is visible to user 503
  When user clicks to button with "#local_pub_ws_bdd-delete" selector 504
  Then wait for 3 seconds 505
  And component with "#workspaces" selector contains 1 children 506


 Scenario: 6
 User creates and delete workflow inputs
 
  Given component with "#private-tab" selector is visible to user 600
  And user clicks to button with "#private-tab" selector 601
  And component with "#local_ws_bdd-input" selector is visible to user 602
  And user clicks to button with "#local_ws_bdd-input" selector 603
  And component with "#repos" selector is visible to user 604
  And user focuses on component with "#repos" selector 605
  And user selects "workflow_a_a" from "#repos" select tag 606
  And component with "#add-workflow-btn" selector is visible to user 607
  And user clicks to button with "#add-workflow-btn" selector 608
  When component with "#panelsStayOpen-collapse-workflow_a_a-btn" selector is visible to user 609
  Then user clicks to button with "#panelsStayOpen-collapse-workflow_a_a-btn" selector 610
  And component with "#input-name-workflow_a_a" selector is visible to user 611
  And user types "PAGE_URL" to input with "#input-name-workflow_a_a" selector 612
  And user clicks to button with "#add-input-btn-workflow_a_a" selector 613
  Then component with "#inputlist-workflow_a_a" selector contains 1 children 614



 Scenario: 7
 User creates edits and deletes workspace vars
  Given component with "#private-tab" selector is visible to user 700
  And user clicks to button with "#private-tab" selector 701
  And component with "#local_ws_bdd-vars" selector is visible to user 702
  And user clicks to button with "#local_ws_bdd-vars" selector 703
  And component with "#var-name-input" selector is visible to user 704
  And user types "COUNTRY" to input with "#var-name-input" selector 705
  And user types "TURKEY" to input with "#var-value-input" selector 706
  When user clicks to button with "#add-var-btn" selector 707
  Then component with "#var-container" selector contains 1 children 708
  And component with "#var-container button[id$='-edit-var-btn']" selector is visible to user 709
  And user clicks to button with "#var-container button[id$='-edit-var-btn']" selector 710
  And input with "#var-name-input" id includes "COUNTRY" value 711
  And input with "#var-value-input" id includes "TURKEY" value 712
  And clear input with "#var-value-input" id 713
  And user types "TURKIYE" to input with "#var-value-input" selector 714
  And clear input with "#var-name-input" id 715
  And user types "COUNTRY_CODE" to input with "#var-name-input" selector 716
  And user clicks to button with "#update-var-btn" selector 717
  And component with "td[id$='-var-name']" id includes "COUNTRY_CODE" textcontent 718


  Scenario: 8
User enables google oauth for selected workflow

   
    Given component with "#private-tab" selector is visible to user 802
    And user clicks to button with "#private-tab" selector 803
    And component with "#local_ws_bdd-oauth" selector is visible to user 804
    And user clicks to button with "#local_ws_bdd-oauth" selector 805
    And component with "#google-oauth-config-link" selector is visible to user 806
    And user clicks to button with "#google-oauth-config-link" selector 807
    And component with "#google-scopes-input" selector is visible to user 808
    And user types "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive" to input with "#google-scopes-input" selector 809
    And user clicks to button with "#save-scopes-btn" selector 810
    And component with "#authenticate-btn" selector is visible to user 811
    And button with "#authenticate-btn" selector is enabled 812
    And user clicks to button with "#authenticate-btn" selector 813
    And component with "#edit-scopes-btn" selector is visible to user 814
    And button with "#edit-scopes-btn" selector is enabled 815


  
  
  #Create,Edit,Delete private, public workspace _done
  #Create, Edit, Delete, workspace vars
  #Create and delete workflow input
  #Navigate to Tasks
  #Enable,Disable Google oauth oauthentication
  #Navigate back using breadcrumb
  #share workspace

#And user clicks to button with "#inputlist-workflow_a_a li button" selector 615
#And component with "#inputlist-workflow_a_a" selector contains 0 children 616


# And component with "td[id$='-var-value']" id includes "TURKIYE" textcontent 719
#  And user clicks to button with "button[id$='-remove-var-btn']" selector 720
#  And component with "#var-container" selector contains 0 children 721