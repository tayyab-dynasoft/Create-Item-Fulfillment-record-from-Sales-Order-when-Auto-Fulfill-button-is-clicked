/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/redirect', 'N/record'], (log, redirect, record) => {
    const onRequest = (scriptContext) => {
        const request = scriptContext.request;
        var soId      = request.parameters.soId;

        try {
            log.debug({
                title  : 'SL | Parameters Received',
                details: JSON.stringify(request.parameters)
            });

            log.debug({ title: 'SL | SO ID', details: soId });

            // Transform Sale Order Data to Fulfilment Page
            var fulfillmentRecord = record.transform({
                fromType : record.Type.SALES_ORDER,
                toType   : record.Type.ITEM_FULFILLMENT,
                fromId   : Number(soId),
                isDynamic: true
            });

            // memo Value Set by Default 
            fulfillmentRecord.setValue({
                fieldId: 'memo',
                value  : 'Auto Generated Item Fulfillment'
            });

            // Set the Status Field By Default
            fulfillmentRecord.setValue({
                fieldId: 'shipstatus',
                value  : 'C'
            });


            //  Sale Order location
            var soRecord   = record.load({
                type: record.Type.SALES_ORDER,
                id  : Number(soId)
            });
            var soLocation = soRecord.getValue({ fieldId: 'location' }) || null;


            //  Set location on fulfillment 
            if (soLocation) {
                fulfillmentRecord.setValue({
                    fieldId: 'location',
                    value  : soLocation
                });
                log.debug({ title: 'SL | Set Header Location', details: soLocation });
            }

            // Set location on  item line 
            var lineCount = fulfillmentRecord.getLineCount({ sublistId: 'item' });
          
            for (var i = 0; i < lineCount; i++) {
                fulfillmentRecord.selectLine({ sublistId: 'item', line: i });

                var lineLocation = fulfillmentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId  : 'location'
                }) || soLocation || null;

                log.debug({ title: 'SL | Line ' + i + ' Location', details: lineLocation || 'No Location — Skipping' });

                if (lineLocation) {
                    fulfillmentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId  : 'location',
                        value    : lineLocation
                    });
                }

                fulfillmentRecord.commitLine({ sublistId: 'item' });
            }

            //Save the Fulfillment 
            var fulfillmentId = fulfillmentRecord.save({
                enableSourcing       : true,
                ignoreMandatoryFields: true  
            });

            log.debug({ title: 'SL | Fulfillment ID Saved', details: fulfillmentId });

            // Redirect to the saved Fulfillment record
            redirect.toRecord({
                type: record.Type.ITEM_FULFILLMENT,
                id  : fulfillmentId
            });

        } catch (error) {
            log.error({ title: 'SL | onRequest Error', details: error });

            redirect.redirect({
                url: '/app/accounting/transactions/salesord.nl?id=' + soId + '&errorMsg=' + encodeURIComponent(error.message)
            });
        }
    };

    return { onRequest };
});