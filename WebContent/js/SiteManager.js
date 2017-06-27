//Globals
var regionPhase;

var SiteManager = {

    init: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        $("#submitButton").on("click", this.WhetherAddORUpdateSite);
        $("#regionDropDown").on("change", this.FillRespectiveDependDropDown);
        $("#CurrencyDropDown").on("change", this.OnCurrencyDropDownChange);
        $(".edit-icon").on("click", this.OnEditIconClick);
        $("#addSiteButton").on("click", this.OnAddSiteClick);
        $(".delete-icon").on("click", this.OnDeleteIconClick);
        $("#deleteButton").on("click", this.OnDeleteButtonClick);
        $("#addsitemodal").on('show.bs.modal', this.ShowModalTitle);
        $("#delta").on("click", this.OnDeltaWiringChecked);
        $("#wye").on("click", this.OnWYEWiringChecked);

        $("#summaryButton").on("click", this.OnSummaryButtonClick);
        $("#backButton").on("click", this.OnBackButtonClick);
        $("#summarymodal").on('shown.bs.modal', this.ShowSummaryORAddSiteModal);
        $("#addsitemodal").on('shown.bs.modal', this.ShowSummaryORAddSiteModal);

    },

    OnSummaryButtonClick: function () {
        $('#addsitemodal').modal('hide');
        $('#summarymodal').modal('show');

        $("#siteNameSummary").text($("#siteNameInput").val());
        $("#regionSummary").text($("#regionDropDown").find("option:selected").text());
        $("#onePhaseSummary").text($("#onePhaseInput").val());
        $("#threePhaseSummary").text($("#threePhaseInput").val());
        $("#currencySummary").text($("#CurrencyDropDown").find("option:selected").text());
        $("#localUtilityRateSummary").text($("#localUtilityRateInput").val());
        $("#pueSummary").text($("#PUEInput").val());
        $("#unitsSummary").text($("#UnitDropDown").find("option:selected").text());
        $("#emissionFactorSummary").text($("#emissionFactorInput").val());
    },

    OnBackButtonClick: function () {
        $('#summarymodal').modal('hide');
        $('#addsitemodal').modal('show');
    },

    ShowSummaryORAddSiteModal: function () {
        $("body").addClass("modal-open");
    },

    OnDeltaWiringChecked: function () {
        SiteManager.AssignPhaseDisplay(1);
    },

    OnWYEWiringChecked: function () {
        SiteManager.AssignPhaseDisplay(2);
    },

    AssignPhaseDisplay: function (wiring) {
        for (var i = 0; i < regionPhase.Phases.length; i++) {
            var phase = regionPhase.Phases[i];

            if (phase.Wiring == wiring) {
                if (phase.PhaseType == 0) {
                    $("#onePhaseInput").val(phase.VoltageDisplay);
                }
                else if (phase.PhaseType == 1) {
                    $("#threePhaseInput").val(phase.VoltageDisplay);
                }

                $("#WiringConnection").data('wiring-connection', phase.Wiring);
            }
        }
    },

    OnCurrencyDropDownChange: function () {
        var currencySymbol = $(this).find("option:selected").data('currency-symbol');
        $("#localUtilityRateUnit").text(currencySymbol);
    },

    ShowModalTitle: function (event) {
        var button = $(event.relatedTarget);
        var recipient = button.data('modal-title-display');
        var modal = $(this);
        modal.find('.modal-title').text(recipient);
    },

    OnAddSiteClick: function () {
        $("#siteNameInput").val("");
        $("#localUtilityRateInput").val("0.15");
        $("#PUEInput").val("2");
        $("#emissionFactorInput").val("");
        $("#submitButtonHidden").val("");

        var $region = $("#regionDropDown");
        $region.prop("selectedIndex", 0);
        SiteManager.FillRespectiveDependDropDown();
    },

    WhetherAddORUpdateSite: function () {
        if (!SiteManager.validateSite()) {
            return false;
        }

        if ($("#submitButtonHidden").val() != 0) {
            SiteManager.updateSite();
        }
        else {
            SiteManager.addSite();
        }
    },

    validateSite: function () {
        var siteName = $("#siteNameInput");
        var localUtilityRateInput = $("#localUtilityRateInput");
        var pueInput = $("#PUEInput");
        var emissionFactorInput = $("#emissionFactorInput");

        if (siteName.val() == 0) {
            alert("Please enter site name");
            $("#siteNameInput").focus();
            return false;
        }

        if (siteName != "" && !SiteManager.onlyCharsAndNumbers('site', siteName.val())) {
            $("#siteNameInput").focus();
            return false;
        }

        if (localUtilityRateInput.val() == 0) {
            alert("Please enter Local Utility Rate");
            $("#localUtilityRateInput").focus();
            return false;
        }

        if (localUtilityRateInput != "" && !SiteManager.onlyNumbers('Local Utility Rate', localUtilityRateInput.val())) {
            $("#localUtilityRateInput").focus();
            return false;
        }

        if (pueInput.val() == 0) {
            alert("Please enter PUE");
            $("#PUEInput").focus();
            return false;
        }

        if (pueInput != "" && !SiteManager.onlyNumbers('PUE', pueInput.val())) {
            $("#PUEInput").focus();
            return false;
        }

        var emissionFactor = emissionFactorInput.val();

        //if (emissionFactorInput.val() == 0) {
        //    alert("Please enter Emission Factor");
        //    $("#emissionFactorInput").focus();
        //    return false;
        //}

        if (emissionFactor != "" && !SiteManager.onlyNumbers('Emission Factor', emissionFactor)) {
            $("#emissionFactorInput").focus();
            return false;
        }

        return true;
    },

    addSite: function () {
        var siteName = $("#siteNameInput").val();
        var countryForInputVoltage = $("#countryForInputVoltage").val();
        var emissionFactor = $("#emissionFactorInput").val();
        var powerUtilizationEffectiveness = $("#PUEInput").val();
        var localUtilityRate = $("#localUtilityRateInput").val();
        var regionId = $("#regionDropDown").val();
        var currencyId = $("#CurrencyDropDown").val();
        var unitValue = $("#UnitDropDown").val();
        var wiring = $("#WiringConnection").data('wiring-connection');

        var siteData = {
            Name: siteName,
            CountryForInputVoltage: countryForInputVoltage,
            LocalUtilityRate: localUtilityRate,
            PowerUtilizationEffectiveness: powerUtilizationEffectiveness,
            EmissionsFactor: emissionFactor,
            RegionId: regionId,
            CurrencyId: currencyId,
            MeasureSystemType: unitValue,
            Wiring: wiring
        };

        $.ajax({
            url: urlActions.Create,
            dataType: "text",
            type: "POST",
            cache: false,
            data: {
                site: siteData
            },
            success: function (data) {
                window.location = urlActions.Index;
            }
        }).fail(Site.onAjaxError);
    },

    updateSite: function () {
        var siteName = $("#siteNameInput").val();
        var countryForInputVoltage = $("#countryForInputVoltage").val();
        var emissionFactor = $("#emissionFactorInput").val();
        var powerUtilizationEffectiveness = $("#PUEInput").val();
        var localUtilityRate = $("#localUtilityRateInput").val();
        var regionId = $("#regionDropDown").val();
        var currencyId = $("#CurrencyDropDown").val();
        var id = $("#submitButtonHidden").val();
        var unitValue = $("#UnitDropDown").val();
        var wiring = $("#WiringConnection").data('wiring-connection');

        var siteData = {
            Id: id,
            Name: siteName,
            CountryForInputVoltage: countryForInputVoltage,
            LocalUtilityRate: localUtilityRate,
            PowerUtilizationEffectiveness: powerUtilizationEffectiveness,
            EmissionsFactor: emissionFactor,
            RegionId: regionId,
            MeasureSystemType: unitValue,
            Wiring: wiring,
            CurrencyId: currencyId
        };

        $.ajax({
            url: urlActions.Update,
            dataType: "text",
            type: "POST",
            data: {
                site: siteData
            },
            success: function (data) {
                window.location = urlActions.Index;
            }
        }).fail(Site.onAjaxError);
    },

    OnDeleteIconClick: function () {
        var id = $(this).data('assigned-id');

        bootbox.confirm({
            closeButton: false,
            message: "Are you sure, you want to delete this site permanently?",
            callback: function (result) {
                if (!result) {
                    return;
                }

                $.ajax({
                    url: urlActions.Delete,
                    dataType: "text",
                    type: "POST",
                    data: { siteId: (id) },
                    success: function (data) {
                        if (data && data != "") {
                            bootbox.alert({
                                closeButton: false,
                                message: data
                            });
                        }
                        else {
                            window.location = urlActions.Index;
                        }
                    }
                }).fail(Site.onAjaxError);
            }
        });
    },

    OnEditIconClick: function () {
        var id = $(this).data('assigned-id');
        var $region = $("#regionDropDown");

        $("#submitButtonHidden").val(id);

        $.ajax({
            url: urlActions.Read,
            dataType: "JSON",
            type: "GET",
            cache: false,
            data: { id: (id) },
            success: function (data) {
                $("#siteNameInput").val(data.Name);
                $("#emissionFactorInput").val(data.EmissionsFactor);
                $("#PUEInput").val(data.PowerUtilizationEffectiveness);
                $("#localUtilityRateInput").val(data.LocalUtilityRate);
                $("#regionDropDown").val(data.Region.Id);
                $("#CurrencyDropDown").val(data.CurrencyId);
                $("#localUtilityRateUnit").text(data.Currency.Symbol);
                $("#UnitDropDown").val(data.MeasureSystemType);
                $("#onePhaseInput").val(data.OnePhase.VoltageDisplay);
                $("#threePhaseInput").val(data.ThreePhase.VoltageDisplay);
                if (data.Wiring == 0 || data.Wiring == 1) {
                    $("#delta").prop("checked", true);
                }
                else if (data.Wiring == 2) {
                    $("#wye").prop("checked", true);
                }

                if (data.Region.Phases.length > 2) {
                    $("#delta").removeAttr("disabled");
                    $("#wye").removeAttr("disabled");
                }

                regionPhase = data.Region;
                $("#WiringConnection").data('wiring-connection', data.Wiring);
                //SiteManager.FillRespectiveDependDropDown();
            }
        })
    },

    onlyCharsAndNumbers: function (nameType, strName) {
        var stringIllegal = '\\ / ( ) < > , ; : " [ ] ? | & ' + "'";
        var illegalChars = /[\\\/\(\)\<\>\,\;\:\"\[\]\?\|\&\']/;
        var strStartChar = /^[A-Za-z0-9]/;
        if (!(strStartChar.test(strName))) {
            alert('Incorrect ' + nameType + ' name. Starting character should not be a symbol.');
            return false;
        }

        if (strName.match(illegalChars)) {
            alert('The ' + nameType + ' name cannot contain these characters:\n   ' + stringIllegal);
            return false;
        }
        else {
            return true;
        }
    },

    onlyNumbers: function (nameType, strName) {
        var stringIllegal = '\\ / ( ) < > , ; : " [ ] ? | & ' + "'";
        var illegalChars = /[\\\/\(\)\<\>\,\;\:\"\[\]\?\|\&\']/;
        var illegalSplChars = /^[A-Za-z]/;
        var illegalSplOneWithChars = /^\d+(?:\.\d{1,5})?$/;

        if (strName.match(illegalSplChars)) {
            alert('The ' + nameType + ' cannot contain characters');
            return false;
        }

        if (!(strName.match(illegalSplOneWithChars))) {
            alert('The ' + nameType + ' cannot contain characters OR need to check digits after decimal points(its limit upto 5)');
            return false;
        }

        if (strName.match(illegalChars)) {
            alert('The ' + nameType + 'cannot contain these characters:\n   ' + stringIllegal);
            return false;
        }
        else {
            return true;
        }
    },

    FillRespectiveDependDropDown: function () {
        var $region = $("#regionDropDown");
        var selectedValue = $region.val();

        $.ajax({
            url: urlActions.GetRegion,
            dataType: "json",
            type: "GET",
            data: { id: (selectedValue) },
            success: function (data) {

                for (var i = 0; i < data.Phases.length; i++) {
                    var phase = data.Phases[i];
                    var delta = (phase.Wiring == 0 || phase.Wiring == 1);
                    var wye = (phase.Wiring == 2);

                    if (phase.PhaseType == 0) {
                        $("#onePhaseInput").val(phase.VoltageDisplay);
                    }
                    else if (phase.PhaseType == 1) {
                        $("#threePhaseInput").val(phase.VoltageDisplay);
                    }

                    if (delta || wye) {
                        $("#delta").attr("disabled", "disabled");
                        $("#wye").attr("disabled", "disabled");

                        $("#delta").prop("checked", delta);
                        $("#wye").prop("checked", wye);
                    }

                    $("#WiringConnection").data('wiring-connection', phase.Wiring);
                }

                if (data.Phases.length > 2) {
                    $("#delta").removeAttr("disabled");
                    $("#wye").removeAttr("disabled");
                }

                $("#CurrencyDropDown").val(data.CurrencyId);
                $("#localUtilityRateUnit").text(data.Currency.Symbol);
                $("#emissionFactorInput").val(data.EmissionsFactor.toFixed(2));
                $("#UnitDropDown").val(data.MeasureSystemType);

                regionPhase = data;
            }
        }).fail(Site.onAjaxError);
    }
};

$(document).ready(function () {
    SiteManager.init();
});

