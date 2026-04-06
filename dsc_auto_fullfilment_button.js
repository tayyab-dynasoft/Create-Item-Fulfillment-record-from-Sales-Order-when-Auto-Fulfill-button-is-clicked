/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/url', 'N/ui/message'], (log, url, message) => {
    const beforeLoad = (scriptContext) => {
        try {
            var currentRecord = scriptContext.newRecord;
            var status        = currentRecord.getValue({ fieldId: 'status' });

            var soId = null;
            if (scriptContext.request) {
                soId = scriptContext.request.parameters.id;
            }
            if (!soId) {
                soId = scriptContext.newRecord.id;
            }

            log.debug({ title: 'UE | Status',    details: status });
            log.debug({ title: 'UE | SO ID',      details: soId });
            log.debug({ title: 'UE | SO ID Type', details: typeof soId });

            // Show error message if redirected back with error
            if (scriptContext.request && scriptContext.request.parameters.errorMsg) {
                scriptContext.form.addPageInitMessage({
                    type   : message.Type.ERROR,
                    title  : 'Auto Fulfill Failed',
                    message: decodeURIComponent(scriptContext.request.parameters.errorMsg)
                });
            }

            if (scriptContext.type !== scriptContext.UserEventType.VIEW) return;

            if (status === 'Pending Fulfillment'|| status === 'Pending Billing/Partially Fulfilled') {
                var suiteletURL = url.resolveScript({
                    scriptId         : 'customscript_dsc_sl_auto_fulfill_v2',
                    deploymentId     : 'customdeploy_dsc_sl_auto_fulfill_v2',
                    returnExternalUrl: false
                });

                suiteletURL = suiteletURL + '&soId=' + soId;

                log.debug({ title: 'UE | Final Button URL', details: suiteletURL });
              
                scriptContext.form.addField({
                    id   : 'custpage_hidden_script',
                    type : 'inlinehtml',
                    label: 'Script'
                }).defaultValue = `
                    <script>
                        function autoFulfillRedirect() {
                            window.location.href = '${suiteletURL}';
                        }
                    </script>
                `;

                scriptContext.form.addButton({
                    id          : 'custpage_btn_auto_fulfill',
                    label       : 'Auto Fulfillment',
                    functionName: 'autoFulfillRedirect'
                });
            }
        } catch (error) {
            log.error({ title: 'beforeLoad | addButton', details: error });
        }
    };

    return { beforeLoad };
});