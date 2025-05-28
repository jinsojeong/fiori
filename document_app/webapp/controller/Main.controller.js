sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sync/ca/fi/documentapp/controller/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    ], (Controller, formatter, Filter, FilterOperator) => {
        "use strict";

    return Controller.extend("sync.ca.fi.documentapp.controller.Main", {
        formatter: formatter,
        onInit() {
            // 최초 로딩 시 '결제건(S)' 필터 적용
            // this._applyFilter("S");
        },

        onFilterSelect: 
        function(oEvent) {
            var sKey = oEvent.getParameter("key"); // 올바른 Key 값을 가져오기
            console.log(sKey);
            this._applyFilter(sKey) // 필터 적용 함수 호출
        },

        onItemPress() {
            // Item 눌렀을때 실행될 코드
            console.log("test");
        },

        //필터 적용 함수
        _applyFilter: function(sKey) {
            var oSmartList = this.byId("DocumentSmartList"); // SmartList ID로 접근
            var oList = oSmartList.getList(); // 내부 List 얻기
            var oBinding = oList.getBinding("items"); // List의 아이템 바인딩

            if (!oBinding) return; // 바인딩이 아직 없으면 종료

            if (sKey === "All") {
                oBinding.filter([]); // 전체 표시
            } else {
                var aFilters = [
                    new Filter("AppStatus", FilterOperator.EQ, sKey)
                ];
                oBinding.filter(aFilters); // AppStatus로 필터링
            }
        }
    });
});    