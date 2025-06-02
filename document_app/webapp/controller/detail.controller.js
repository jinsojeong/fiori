sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sync/ca/fi/documentapp/controller/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",  // ✅ 추가
    "sap/m/MessageToast"
], function (Controller,formatter, Fragment, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("sync.ca.fi.documentapp.controller.Detail", {
        onInit: function () {
            
        },
        _onRouteMatched: function (oEvent) {
            const oArgs = oEvent.getParameter("arguments");
            const sPath = `/ZCA_CDS_V_005(Belnr='${oArgs.Belnr}',Bukrs='${oArgs.Bukrs}',Gjahr='${oArgs.Gjahr}')`;
            
            const oView = this.getView();
            oView.bindElement({ 
                path: sPath,
                parameters: {
                    expand: "toi" // 아이템 가져오기 
                },
                events: {
                    
                }
            });

            // FlexibleColumnLayout mid column 전환
            const oFCL = this.getView().getParent().getParent();
            if (oFCL.setLayout) {
                oFCL.setLayout("TwoColumnsMidExpanded");
            }

            const oContext = oView.getBindingContext();
            if(!oContext) return;

            const aItems = oContext.getProperty("toi") || [];

            const result = this.calculateBalanceMessage(aItems);
            if(oMsgStrip) {
                oMsgStrip.setText(result.text);
                oMsgStrip.setType(result.matched ? "Success" : "Error");
                oMsgStrip.setVisible(true);
            }
        },

        formatter: formatter,
        onNavBack: function () {
            // 현재 View로부터 FlexibleColumnLayout 찾기
            const oFCL = this.getView().getParent().getParent();

            // FCL이 존재하면 OneColumn 레이아웃으로 설정
            if (oFCL && oFCL.setLayout) {
                oFCL.setLayout("OneColumn");
            } else {
                console.error("FlexibleColumnLayout를 찾을 수 없습니다.");
            }
        },
        onFullScreen: function () {
            const oFCL = this.getView().getParent().getParent();

            if (oFCL && oFCL.setLayout) {
                oFCL.setLayout("MidColumnFullScreen");  // 중간 컬럼을 전체화면으로 확장
            } else {
                console.error("FlexibleColumnLayout을 찾을 수 없습니다.");
            }
        },
        openDialog: function () {
            const oView = this.getView();

            if (!this._pApproveDialog) {
                this._pApproveDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),  // 꼭 View ID를 부여
                    name: "sync.ca.fi.documentapp.view.ApproveDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pApproveDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onUpdate() {
            console.log("onUpdate called");

            const oView = this.getView();
            const oContext = oView.getBindingContext();

            if (!oContext) {
                console.error("No binding context found.");
                return;
            }

            const oData = {
                Belnr: oContext.getProperty("Belnr"),
                Bukrs: oContext.getProperty("Bukrs"),
                Gjahr: oContext.getProperty("Gjahr"),
                Budat: oContext.getProperty("Budat"),
                Bltxt: oContext.getProperty("Bltxt"),
                Recipient: oContext.getProperty("Recipient"),
                RecDate: oContext.getProperty("RecDate"),
                AppStatus: oContext.getProperty("AppStatus"),
                Opinion: oContext.getProperty("Opinion"),
                Approver: oContext.getProperty("Approver"),
                AppDate: oContext.getProperty("AppDate")
            };
            console.log("📌 Header Data for Popup:", oData);

            // 모델 생성 및 바인딩
            const oModel = new sap.ui.model.json.JSONModel(oData);
            oView.setModel(oModel, "updateModel");

            this.openDialog();        
        },
        onCancelApproval() {
            this._pApproveDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConfirmApproval() {
            const oView = this.getView();
            const oModel = oView.getModel(); // 기본 ODataModel
            const oUpdateModel = oView.getModel("updateModel");
            const oData = oUpdateModel.getData();

            // 현재 날짜: Edm.DateTime용 SAP 포맷 (Date 객체)
            const oToday = new Date();

            // 현재 로그인 사용자 ID (Fiori Launchpad 환경 기준)
            const sUserId = sap.ushell.Container.getUser().getId();

            // Fragment 내부 컨트롤 접근
            const sComment = sap.ui.core.Fragment.byId(oView.getId(), "approvalComment").getValue();
            const sAppStatus = oUpdateModel.getProperty("/AppStatus");

            // 유효성 검사
            if (!sAppStatus) {
                MessageBox.warning("결재 상태를 선택하세요.");
                return;
            }

            // OData 키 path 생성
            const sPath = oModel.createKey("/ZCA_CDS_V_005", {
                Belnr: oData.Belnr,
                Bukrs: oData.Bukrs,
                Gjahr: oData.Gjahr
            });

            // 수정할 필드만 포함
            const oUpdatedEntry = {
                AppStatus: sAppStatus,
                Opinion: sComment,
                Approver: sUserId,
                AppDate: oToday
            };

            // PATCH 방식으로 업데이트 (merge: true)
            oModel.update(sPath, oUpdatedEntry, {
                merge: true, // 일부 필드만 업데이트
                success: () => {
                    MessageToast.show("결재가 완료되었습니다.");
                    this._pApproveDialog.then(oDialog => oDialog.close());
                    oModel.refresh(true);
                },
                error: (oError) => {
                    MessageBox.error("결재 처리 중 오류가 발생했습니다.");
                    console.error(oError);
                }
            });
        },
        onSelectApprove: function () {
            const oModel = this.getView().getModel("updateModel");
            oModel.setProperty("/AppStatus", "A");
        },

        onSelectReject: function () {
            const oModel = this.getView().getModel("updateModel");
            oModel.setProperty("/AppStatus", "R");
        },
    });
});