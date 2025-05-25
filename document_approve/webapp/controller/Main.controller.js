sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sync/ca/fi/documentapprove/controller/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("sync.ca.fi.documentapprove.controller.Main", {
        formatter: formatter,  // 정상 동작
        onInit: function () {
            // 초기화 코드
        }
    });
});