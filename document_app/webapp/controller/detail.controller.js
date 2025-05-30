sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sync.ca.fi.documentapp.controller.Detail", {
        onInit: function () {
            
        },

        _onRouteMatched: function (oEvent) {
            const oArgs = oEvent.getParameter("arguments");
            const sPath = `/ZCA_CDS_V_005(Belnr='${oArgs.Belnr}',Bukrs='${oArgs.Bukrs}',Gjahr='${oArgs.Gjahr}')`;

            this.getView().bindElement({ path: sPath });

            // FlexibleColumnLayout mid column 전환
            const oFCL = this.getView().getParent().getParent();
            if (oFCL.setLayout) {
                oFCL.setLayout("TwoColumnsMidExpanded");
            }
        }
    });
});