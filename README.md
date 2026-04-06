# Create-Item-Fulfillment-record-from-Sales-Order-when-Auto-Fulfill-button-is-clicked
Need to add button, “Auto Fulfill” on Sales Order form  Add functionality behind the button  On button click, create an Item Fulfillment record with full or remaining Sales Order quantities in MEMO field of IFF, always set value: “Auto generated Item Fulfillment”. Note: Use Suitelet script to create an item fulfillment
Receive response from Suitelet script and reload page if Item Fulfillment got created successfully
Note:  In case, Item Fulfillment was not created due to an error then display the error message.

The “Auto Fulfill” button should only appear on SO form when SO status is “Pending Fulfillment” or “Partially Fulfilled”

Sol:

For this Task Two Script is created one is UserEvent Script  "dsc_auto_fullfilment_button.js" and second Scirpt is SuiteLet "dsc_SL_auto_fil_btn_v2.js".

Button is added and display on Sale Order when Sale Order status is Pending Fulfillment OR Partially Fulfilled and Functionaly active,

When the Button is clicked it call the SuiteLet Script 

SuiteLet Script Tranfrom the sale Order Data to Fulfilment and set the Memo as default “Auto generated Item Fulfillment”

If there is any error in creating Fulfilment it redircet it to Sale Order and Display error Message 
