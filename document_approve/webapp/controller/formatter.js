// formatter.js
sap.ui.define([], function () {
    "use strict";

    return {
        formatStatusIcon: function (status) {
            console.log("ICON:", status); // ← 추가
            if (!status) return "sap-icon://question-mark";
            switch (status.toUpperCase()) {
                case "N": return "sap-icon://document";
                case "S": return "sap-icon://request";
                case "A": return "sap-icon://accept";
                case "R": return "sap-icon://decline";
                default:  return "sap-icon://question-mark";
            }
        },
        formatStatusState: function (status) {
            switch (status) {
                case "N": return "None";
                case "S": return "Information";
                case "A": return "Success";
                case "R": return "Error";
                default:  return "None";
            }
        },
        formatStatusText: function (status) {
            switch (status) {
                case "N": return "신규";
                case "S": return "상신";
                case "A": return "승인";
                case "R": return "반려";
                default:  return status;
            }
        }
    };
});