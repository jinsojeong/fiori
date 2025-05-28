// formatter.js
sap.ui.define([], function () {
    "use strict";

    return {
        formatStatusIcon: function (status) {
            // console.log("ICON:", status); // ← 추가
            if (!status) return "sap-icon://question-mark";
            switch (status.toUpperCase()) {
                case "S": return "sap-icon://bbyd-active-sales";
                case "A": return "sap-icon://accept";
                case "R": return "sap-icon://decline";
                default:  return "sap-icon://question-mark";
            }
        },
        formatStatusState: function (status) {
            switch (status) {
                case "S": return "Warning";
                case "A": return "Success";
                case "R": return "Error";
                default:  return "None";
            }
        },
        formatStatusText: function (status) {
            switch (status) {
                case "S": return "상신";
                case "A": return "승인";
                case "R": return "반려";
                default:  return status;
            }
        }
    };
});