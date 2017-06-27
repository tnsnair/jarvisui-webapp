
// Always use strict mode to avoid bad declarations.
'use strict'

//-- Globals --//

var viewModel;
var $selectedElement;

//-- Models --//

var PowerSummaryResult = function () {
    var self = this;

    self.PowerConsumption = ko.observable();
    self.HeatDissipation = ko.observable();
    self.AnnualizedEnergyCost = ko.observable();
    self.CarbonEmissions = ko.observable();

    self.LocalUtilityRate = ko.observable();
    self.EmissionsFactor = ko.observable();
    self.PUE = ko.observable();
};

var PowerInterfaceResult = function () {
    var self = this;

    self.PhaseType = ko.observable();
    self.InputVoltage = ko.observable();
}

var PhysicalResult = function () {
    var self = this;

    self.SoundPressure = ko.observable();
    self.SoundPower = ko.observable();
    self.Weight = ko.observable();
    self.RackUnits = ko.observable();
    self.Width = ko.observable();
    self.Depth = ko.observable();
    self.Height = ko.observable();
    self.FrontClearance = ko.observable();
    self.RearClearance = ko.observable();
    self.TopClearance = ko.observable();
    self.RawCapacityInTb = ko.observable();
};

//-- ViewModels --//

var DashboardViewModel = function () {
    var self = this;

    self.buildConfig = new Object();
    self.buildConfigName = ko.observable();

    self.powerSummaryResult = new PowerSummaryResult();
    self.powerInterfaceResult = new PowerInterfaceResult();
    self.physicalResult = new PhysicalResult();
    self.currentResults;

    self.findNode = function (siteId, systemConfigId, rackId, hardwareId) {
        var site;
        var systemConfig;
        var rack;
        var hardware;

        $.each(self.buildConfig.Sites, function (index, value) {
            if (value.Id != siteId) {
                return; // break;
            }

            site = value;

            $.each(site.SystemConfigs, function (index, value) {
                if (value.Id != systemConfigId) {
                    return; // break;
                }

                systemConfig = value;

                $.each(systemConfig.Racks, function (index, value) {
                    if (value.ConfigId != rackId) {
                        return; // break;
                    }

                    rack = value;

                    $.each(rack.Hardwares, function (index, value) {
                        if (value.ConfigId != hardwareId) {
                            return; // break;
                        }

                        hardware = value;
                    });
                });
            });
        });

        return {
            site: site,
            systemConfig: systemConfig,
            rack: rack,
            hardware: hardware
        };
    }

    self.findSystem = function (name) {
        var systemConfig;

        $.each(self.buildConfig.SystemConfigs, function (index, value) {
            if (value.Name == name) {
                systemConfig = value;
                return false
            }
        });

        return systemConfig;
    };

    self.updateConfig = function (buildConfig) {
        self.buildConfig = buildConfig;
        self.buildConfigName(buildConfig.Name);
    };

    self.updatePowerSummary = function (powerSummaryResult) {
        ko.mapping.fromJS(powerSummaryResult, {}, viewModel.powerSummaryResult);
    },

    self.updateResults = function (powerSummaryResult, powerInterfaceResult, physicalResult, site) {
        ko.mapping.fromJS(powerSummaryResult, {}, viewModel.powerSummaryResult);
        ko.mapping.fromJS(powerInterfaceResult, {}, viewModel.powerInterfaceResult);
        ko.mapping.fromJS(physicalResult, {}, viewModel.physicalResult);

        self.powerSummaryResult.LocalUtilityRate(site.LocalUtilityRate);
        self.powerSummaryResult.EmissionsFactor(site.EmissionsFactor);
        self.powerSummaryResult.PUE(site.PowerUtilizationEffectiveness);
    };

    self.resetResults = function () {
        var site = new Object();
        var powerSummaryResult = new PowerSummaryResult();
        var powerInterfaceResult = new PowerInterfaceResult();
        var physicalResult = new PhysicalResult();

        self.updateResults(powerSummaryResult, powerInterfaceResult, physicalResult, site);
    };
};

//-- UI --//

var Dashboard = {

    init: function () {

        viewModel = new DashboardViewModel();

        this.bindEvents();
        this.getBuildConfig();

        ko.applyBindings(viewModel);
        
    },

    initTree: function () {
        $('#configTree').jstree({
            "core": {
                'check_callback': true,
                "themes": {
                    'name': 'proton',
                    "icons": false // Remove folder icons.                  
                }
            },
            "plugins": ["wholerow"]
        });
    },

    bindEvents: function () {

        //this.getDropdowns;
        //$("#SubmitButton").on("click", this.getDropdowns);
        $("#configSelect").on("change", this.onConfigSelected);
        $("#newConfig").on("click", this.onNewConfig);
        $("#saveConfig").on("click", this.onSaveConfig);

        $("#duplicateNode").on("click", this.onDuplicateNode);
        $("#deleteNode").on("click", this.onDeleteNode);

        // Only bind to parent panel-heading
        $("#pnlEnvironmentData .clickable").first().on("click", this.onPanelHeaderClick);

        $("#pnlEnvironmentData .collapsible")
            .on("show.bs.collapse", this.onPanelShow)
            .on("hide.bs.collapse", this.onPanelHide);

        $("input[name='mode']").on("click", this.onModeSelected);

        // TODO: Enable for Mobile version
        //$(".fa-chevron-direction").click(this.OnFaChevronIconClick);
    },

    bindTreeEvents: function () {
        $("#configTree").on('ready.jstree', this.onTreeReady);
        $("#configTree").on("select_node.jstree", this.onNodeSelected);
        $("#configTree").on("open_node.jstree", this.onNodeExpanded);
    },

    onNewConfig: function () {
        bootbox.confirm({
            closeButton: false,
            message: "Are you sure you want to start a new configuration?",
            callback: function (result) {
                if (!result) {
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: urlActions.New,
                    success: function (buildConfig) {

                        viewModel.updateConfig(buildConfig);
                        viewModel.resetResults();

                        Dashboard.clearTree();
                        Dashboard.disableButtons(true);
                        Dashboard.reset();
                    }
                }).fail(Site.onAjaxError);
            }
        });
    },

    onSaveConfig: function () {
        if (viewModel.buildConfig.SystemConfigs.length == 0) {

            bootbox.alert({
                closeButton: false,
                message: "Please add atleast one System to save a configuration."
            });
            return;
        }

        var buildConfigId = viewModel.buildConfig.Id;
        var customerName;

        if (buildConfigId == 0) {
            customerName = prompt("Please enter customer name.");
            if (customerName == undefined || customerName.trim() == '') {
                return false;
            }
            else {
                var nameAlreadyExists = false;

                $('#configSelect option').each(function () {
                    if (this.text.toLowerCase() == customerName.toLowerCase()) {
                        nameAlreadyExists = true;
                        return;
                    }
                });

                if (nameAlreadyExists) {
                    bootbox.alert({
                        closeButton: false,
                        message: "Customer name already exists. Please provide different name."
                    });

                    return;
                }
            }
        }

        //$.ajax({
        //    type: "POST",
        //    url: urlActions.NumberOfFiles,
        //    data: {
        //        customerName: customerName
        //    },
        //    success: function (html) {
        //        //alert("Hi..");
        //        //$("#treeBuildConfig").jstree('destroy');
        //        $("#DropdownPartialView").html(html);

        //        Dashboard.getDropdowns();

        //        bootbox.alert({
        //            closeButton: false,
        //            message: "Succesfully saved configuration."
        //        });
        //    }
        //}).fail(Site.onAjaxError);
    },

    //getDropdowns: function () {
    //    $.ajax({
    //        url: urlActions.NumberOfFiles,
    //        type: 'POST',
    //        cache: false,
    //        success: function (html) {
    //            //viewModel.updateConfig(buildConfig);
    //            //alert("Hi..");
    //            $("#DropdownPartialViewSource").html(html);
    //            $("#DropdownPartialViewDestination").html(html);
    //            //var data = { 'Country': 'India', 'Country1': 'USA', 'Country2': 'Australia', 'Country3': 'Srilanka' };
    //            //for (var i = 0; i < 5; i++) {
    //            //    var s = $('<select />');

    //            //    for (var val in data) {
    //            //        $('<option />', { value: val, text: data[val] }).appendTo(s);
    //            //    }

    //            //    s.appendTo('body');
    //            //}



    //            //Dashboard.initTree();
    //            //Dashboard.bindTreeEvents();

    //            //var exists = $("#configSelect option[value='" + buildConfig.Id + "']").length !== 0;

    //            //if (buildConfig.Id != 0)
    //            //{

    //            //    //if (!exists)
    //            //    {
    //            //        var optionToAdd = "<option value='" + 0 + "'>" + 1 + "</option>";
    //            //        $("#ddlApplyAllSource").append(optionToAdd);
    //            //    }

    //            //    //$("#configSelect").val(0);
    //            //}
    //            //else {
    //            //    $("#configSelect").prop("selectedIndex", 0);
    //            //}
    //        }
    //    }).fail(Site.onAjaxError);
    //},

    onConfigSelected: function () {
        var id = $('#configSelect').val();

        if (!id || id == "0")
            return;

        $.ajax({
            url: urlActions.GetTree,
            type: 'GET',
            cache: false,
            data: {
                buildConfigId: id
            },
            success: function (html) {
                $("#treeBuildConfig").jstree('destroy');
                $("#treePartialView").html(html);

                Dashboard.getBuildConfig();
            }
        }).fail(Site.onAjaxError);
    },

    getBuildConfig: function () {
        $.ajax({
            url: urlActions.Get,
            type: 'GET',
            cache: false,
            success: function (buildConfig) {
                viewModel.updateConfig(buildConfig);

                Dashboard.initTree();
                Dashboard.bindTreeEvents();

                var exists = $("#configSelect option[value='" + buildConfig.Id + "']").length !== 0;

                if (buildConfig.Id != 0) {
                    if (!exists) {
                        var optionToAdd = "<option value='" + buildConfig.Id + "'>" + buildConfig.Name + "</option>";
                        $("#configSelect").append(optionToAdd);
                    }

                    $("#configSelect").val(buildConfig.Id);
                }
                else {
                    $("#configSelect").prop("selectedIndex", 0);
                }
            }
        }).fail(Site.onAjaxError);
    },

    onDeleteNode: function () {
        var siteId = $selectedElement.data("site-id");
        var systemConfigId = $selectedElement.data("system-config-id");
        var rackId = $selectedElement.data("rack-id");
        var hardwareId = $selectedElement.data("hardware-id");
        var type = $selectedElement.data("type");

        var findNodeResult = viewModel.findNode(siteId, systemConfigId, rackId, hardwareId);

        if (type == "SystemConfig") {
            var systemConfig = findNodeResult.systemConfig;
            var systemConfigs = viewModel.buildConfig.SystemConfigs;
            var index = $.inArray(systemConfig, systemConfigs);

            systemConfigs.splice(index, 1);
            viewModel.resetResults();
        }

        Dashboard.updateBuildConfig();
    },

    onDuplicateNode: function () {
        var siteId = $selectedElement.data("site-id");
        var systemConfigId = $selectedElement.data("system-config-id");
        var rackId = $selectedElement.data("rack-id");
        var hardwareId = $selectedElement.data("hardware-id");
        var type = $selectedElement.data("type");

        var findNodeResult = viewModel.findNode(siteId, systemConfigId, rackId, hardwareId);

        if (type == "SystemConfig") {
            var systemConfig = findNodeResult.systemConfig;

            // Note: Do not use bootbox as prompts requires customization.
            // TODO: Use numbers similar to Duplicate Rack.
            var cloneName = prompt("Please enter system name.", systemConfig.Name + " (Copy)");

            if (cloneName == undefined || cloneName.trim() == '') {
                return;
            }

            var systemConfigFound = viewModel.findSystem(cloneName);

            if (systemConfigFound) {
                bootbox.alert({
                    closeButton: false,
                    message: "System name already exists. Please provide different name."
                });
                return;
            }

            var systemConfigs = viewModel.buildConfig.SystemConfigs;
            var index = $.inArray(systemConfig, systemConfigs);

            var clonedSystemConfig = jQuery.extend(true, {}, systemConfig);
            clonedSystemConfig.Id = 0;
            clonedSystemConfig.Name = cloneName;

            systemConfigs.push(clonedSystemConfig);
        }

        Dashboard.updateBuildConfig();
    },

    onModeSelected: function () {
        var isMaximum = $("#maximum").is(":checked");
        var currentResults = viewModel.currentResults;

        if (currentResults) {
            var powerSummaryResult;

            if (isMaximum) {
                powerSummaryResult = currentResults.NormalMode;
            }
            else {
                powerSummaryResult = currentResults.RechargeMode;
            }

            viewModel.updatePowerSummary(powerSummaryResult);
        }
    },

    updateBuildConfig: function () {
        // Remove references which are mapped to interfaces
        viewModel.buildConfig.Sites = undefined;

        $.each(viewModel.buildConfig.SystemConfigs, function (index, value) {
            var systemConfig = value;
            value.Racks = undefined;
        })

        // HACK: DateTime formatting issue with default .NET Javascript serializer
        // TODO: Try using Newtonsoft JSON serializer
        viewModel.buildConfig.LastUpdated = undefined;

        $.ajax({
            url: urlActions.Update,
            type: 'POST',
            data: {
                buildConfig: viewModel.buildConfig
            },
            success: function (html) {
                $("#treeBuildConfig").jstree('destroy');
                $("#treePartialView").html(html);

                Dashboard.getBuildConfig();
            }
        }).fail(Site.onAjaxError);
    },

    onTreeReady: function () {
        var $configTree = $('#configTree');

        var firstNodeLevel1 = $configTree.jstree('get_node', '[aria-level=1]:first');
        var firstNodeLevel2;
        var firstNodeLevel3;
        var nodeToSelect;

        // To open an element, that element should first exists on DOM.
        // By default root node is on DOM, so you can dirctly open it. But to open other lower level nodes their respective parent nodes should open first.
        // Likewise to select a node it should be opened first.
        // TODO: This to optimize with a loop and dynamic level selection.
        if (firstNodeLevel1 != false) {
            $configTree.jstree('open_node', firstNodeLevel1);
            firstNodeLevel2 = $configTree.jstree('get_node', '[aria-level=2]:first');
            if (firstNodeLevel2 != false) {
                $configTree.jstree('open_node', firstNodeLevel2);
                firstNodeLevel3 = $configTree.jstree('get_node', '[aria-level=3]:first');
                if (firstNodeLevel3 != false) {
                    $configTree.jstree('open_node', firstNodeLevel3);
                    nodeToSelect = firstNodeLevel3;
                }
                else {
                    nodeToSelect = firstNodeLevel2;
                }
            }
            else {
                nodeToSelect = firstNodeLevel1;
            }
        }

        if (nodeToSelect) {
            $configTree.jstree('select_node', nodeToSelect);
            $('#powerSummaryPanel').collapse('show');
        }
        else {
            $('#powerSummaryPanel').collapse('hide');
        }
    },

    onNodeSelected: function (e, data) {
        $selectedElement = $("#" + data.selected[0]);

        var siteId = $selectedElement.data("site-id");
        var systemConfigId = $selectedElement.data("system-config-id");
        var rackId = $selectedElement.data("rack-id");
        var hardwareId = $selectedElement.data("hardware-id");
        var type = $selectedElement.data("type");
        var productId = $selectedElement.data("product-id");
        var urlForEdit = $selectedElement.data("product-url");

        if (type == 'Site') {
            Dashboard.disableButtons(true);
            $('#deleteNode').prop('disabled', false);
        }
        else if (type == 'SystemConfig') {
            Dashboard.disableButtons(false);
            $('#systemConfigIdForEdit').attr('value', systemConfigId);
            $('#productIdForEdit').attr('value', productId);
            $("#editNode").parent("form").attr("action", urlForEdit);
        }
        else {
            Dashboard.disableButtons(true);
        }

        if (type == "SystemConfig" || type == "Rack") {
            var isMaximum = $("#maximum").is(":checked");
            var findNodeResult = viewModel.findNode(siteId, systemConfigId, rackId, hardwareId);
            var site = findNodeResult.site;
            var node;
            var powerSummaryResult;

            if (type == "SystemConfig") {
                node = findNodeResult.systemConfig;
            }
            else if (type == "Rack") {
                node = findNodeResult.rack;
            }

            if (isMaximum) {
                powerSummaryResult = node.CalculationResult.NormalMode;
            }
            else {
                powerSummaryResult = node.CalculationResult.RechargeMode;
            }

            var powerInterfaceResult = node.CalculationResult.PowerInterface;
            var physicalResult = node.CalculationResult.Physical;

            viewModel.currentResults = node.CalculationResult;
            viewModel.updateResults(powerSummaryResult, powerInterfaceResult, physicalResult, site);
        }
        else {
            viewModel.currentResults = undefined;
            viewModel.resetResults();
        }
    },

    onNodeExpanded: function (e, data) {
        var $openedNode = $("#" + data.node.id).find(".jstree-node");

        $($openedNode).each(function () {
            $(this).find('span.badge').remove();

            var count = parseInt($(this).data("count"));
            $(this).find('a').addClass("truncate");
            var $div = $(this).find('> div');

            if (count > 0) {
                $('<span class="badge count-badge pull-right">' + count + '</span>').insertBefore($div);
            }
        });
    },

    onPanelHeaderClick: function () {
        var $this = $(this);

        if ($this.data('collapsed') == 'true') {
            $('.panel-collapse').collapse('hide');
            $this.data('collapsed', 'false');
        }
        else {
            $('.panel-collapse').collapse('show');
            $this.data('collapsed', 'true');
        }
    },

    onPanelShow: function () {
        $(this).find(".panel-heading").addClass("active");
    },

    onPanelHide: function () {
        $(this).find(".panel-heading").removeClass("active");
    },

    // TODO: Enable for Mobile version

    //OnFaChevronIconClick: function() {
    //    $(this).toggleClass("fa-rotate-180")
    //    $("#col1").toggleClass("container-closed")
    //    $("#pnlEnvironmentData").toggleClass("fixed-fluid col-2-up")
    //},

    disableButtons: function (state) {
        $('#editNode').prop('disabled', state);
        $('#duplicateNode').prop('disabled', state);
        $('#deleteNode').prop('disabled', state);
    },

    clearTree: function () {
        $("#configTree").jstree('destroy');
        $("#treePartialView").html('');
        $('.panel-collapse').collapse('hide');
    },

    reset: function () {
        $("#configSelect").prop("selectedIndex", 0);
    }
};

$(document).ready(function () {

    Dashboard.init();
    //$("#DropdownPartialView").html(html);

    //Dashboard.getDropdowns();

});
