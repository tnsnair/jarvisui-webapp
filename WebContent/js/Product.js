
// Always use strict mode to avoid bad declarations.
'use strict'

//-- Globals --//

var viewModel;
var currentZoom = 1.0;

//-- Models --//

var InnerHardwareConfig = function (slotHardware) {
    var self = this;
    self.PartId = ko.observable(slotHardware.PartId);
    self.Count = ko.observable(slotHardware.Count);
    self.Index = ko.observable(slotHardware.Index);
    self.Name = ko.observable(slotHardware.Name);
};

var HardwareConfig = function (Index, PartId, Count, RackUnits) {
    var self = this;
    self.PartId = ko.observable(PartId);
    self.Count = ko.observable(Count);
    self.Index = ko.observable(Index);
    self.RackUnits = ko.observable(RackUnits);
    self.HardwareConfigs = ko.observableArray([]);

    self.Clone = function (index) {
        var clone = new HardwareConfig(index, self.PartId(), self.Count(), self.RackUnits());

        clone.Name = self.Name;
        clone.ModelType = self.ModelType;
        clone.Category = self.Category;
        clone.SlotCapacity = self.SlotCapacity;
        clone.SlotFormFactor = self.SlotFormFactor;
        clone.ColorCode = self.ColorCode;

        var slotHardwareConfigs = self.HardwareConfigs();

        for (var q = 0; q < slotHardwareConfigs.length; q++) {
            clone.HardwareConfigs.push(slotHardwareConfigs[q]);
        }

        return clone;
    }
};

var RackConfig = function (id, rackName, partid, rackUnitCapacity) {
    var self = this;

    self.Id = ko.observable(id);
    self.Name = ko.observable(rackName);
    self.PartId = ko.observable(partid);
    self.RackUnitCapacity = ko.observable(rackUnitCapacity);
    self.HardwareConfigs = ko.observableArray([]);

    self.Slots = ko.pureComputed(function () {
        var slots = [];

        for (var i = self.RackUnitCapacity() ; i > 0; i--) {
            slots.push(i);
        }

        return slots;
    });
};

var SystemConfig = function () {
    //var self = this;

    //self.SiteId = ko.observable(0);
    //self.Name = ko.observable("System Build 1");
    //self.PhaseType = ko.observable(-1);
    //self.OperatingTemperature = ko.observable(25);
    //self.ProductId = 0;
    //self.RackConfigs = ko.observableArray([]);
};

//-- ViewModels --//
var ProductViewModel = function (systemConfig) {
    var self = this;

    //self.SystemConfig = systemConfig;
    //self.Elements = elements;
    //self.FilteredElements = ko.observableArray([]);
    //self.SelectedElementCategory = ko.observable();
    //self.SelectedElement = ko.observable();
  
    
};

//-- UI --//

var Product = {

    init: function () {

        this.bindEvents();

        var systemConfig = new SystemConfig();
        systemConfig.ProductId = parseInt($("#productId").val());

        viewModel = new ProductViewModel(elementList, systemConfig);
        //ko.applyBindings(viewModel);

        //$('[data-toggle="tooltip"]').tooltip();

        //Product.onTemperatureChange();

        //if (currentSystemConfig) {
        //    //Product.ParseSystemConfig(currentSystemConfig);
        //    $("#reset").prop('disabled', true);
        //}
        //else {
        //    if (DEBUG) {
        //        viewModel.SystemConfig.PhaseType(1);
        //        $("#RackTypeDropDown").prop("selectedIndex", 1);
        //    }
        //}
    },

    bindEvents: function () {
        $("#temperatureInput").on("change", this.onTemperatureChange);
        $("#siteNameInput").on("change", this.onSiteChange);
        $("#edit").on("click", this.onEditClick);
        $("#duplicate").on("click", this.onDuplicateClick);
        $("#details").on("click", this.onDetailsClick);
        $("#delete").on("click", this.onDeleteClick);
        $("#saveDetails").on("click", this.onSaveClick);
        $("#cancelDetails").on("click", this.onCancelClick);
        $("#close").on("click", this.onCancelClick);
        $("#zoomin").on("click", this.onZoomInClick);
        $("#zoomout").on("click", this.onZoomOutClick);
        $("#download").on("click", this.onDownloadClick);
        $("#reset").on("click", this.onResetClick);
        $("#next").on("click", this.onNextClick);
        $("#cancelProduct").on("click", this.onCancelProductClick);
    },

    onTemperatureChange: function (data, event) {
        var temperatureValue = $("#temperatureInput :selected").val();
        switch (temperatureValue) {
            case "25":
                $("#temperatureNote").text("Chassis fan operation is running at normal speed.");
                break;
            case "26":
                $("#temperatureNote").text("Chassis fan operation starts adaptive cooling.");
                break;
            case "36":
                $("#temperatureNote").text("Chassis fan operation maximizes adaptive cooling. Fans increase to full capacity.");
                break;
        }
    },

    onHardwareDragStart: function (event, ui) {
        var $draggable = $(this);
        var $droppable = $draggable.parent(".droppable");
        var hardwareConfig = $draggable.data("hardwareConfig");

        if ($droppable.length > 0) {
            var $rackContainer = $droppable.closest(".rack-container");

            // Used to revert following changes on Stop event.
            $droppable.data("dropSuccess", false);

            var rackConfig = $rackContainer.data("rackConfig");
            rackConfig.HardwareConfigs.pop(hardwareConfig);

            Product.ToggleDroppable($droppable, true, hardwareConfig.RackUnits());
            Product.GetRackCalculationResults($rackContainer);
        }

        Product.DisableAllDroppable(hardwareConfig.RackUnits());
    },

    onHardwareDragStop: function (event, ui) {
        var $draggable = $(this);
        var $droppable = $draggable.parent(".droppable");
        var hardwareConfig = $draggable.data("hardwareConfig");
        var $rackContainer = $draggable.closest(".rack-container");

        if ($droppable.length > 0 && !$droppable.data("dropSuccess")) {
            var rackConfig = $droppable.closest('.rack-container').data("rackConfig");

            rackConfig.HardwareConfigs.push(hardwareConfig);

            Product.ToggleDroppable($droppable, false, hardwareConfig.RackUnits());
        }

        Product.EnableAllDroppable(hardwareConfig.RackUnits());

        if ($rackContainer.length > 0) {
            Product.GetRackCalculationResults($rackContainer);
        }
    },

    onHardwareDrop: function (event, ui) {
        var $draggable = $(ui.draggable);
        var $droppable = $(this);

        var hardwareConfig = $draggable.data("hardwareConfig");
        var hardware = $draggable.data("hardware");
        var rackConfig = $droppable.closest(".rack-container").data("rackConfig");

        // Class gets removed on DropHardware
        var isHelper = $draggable.hasClass("helper");

        hardwareConfig.Index($droppable.data("slotIndex"));
        $droppable.data("dropSuccess", true);

        rackConfig.HardwareConfigs.push(hardwareConfig);

        Product.DropHardware(hardwareConfig, $draggable, $droppable);
        Product.ToggleDroppable($droppable, false, hardwareConfig.RackUnits());

        if (isHelper) {
            // Reset to avoid showing Element Details
            $(".detailSection").addClass("hide");

            // Re-create draggable helper
            var clone = hardwareConfig.Clone(0);
            //var hardwareClone = hardware.Clone(0);
            var $draggableHardware = Product.CreateDraggableHardware(clone, hardware);
            $(".draggable-container").append($draggableHardware);
        }

        Product.SelectHardware($draggable, isHelper);
    },

    onHardwareClick: function () {
        var $draggable = $(this);
        Product.SelectHardware($draggable);
    },

    onEditClick: function () {
        var $draggable = $(".draggable.selected");
        var $rack = $(".rack.selected");

        if ($draggable.length > 0) {
            Product.EditElement($draggable, true);
        }
        else if ($rack) {
            Product.EditRack($rack);
        }
    },

    onDuplicateClick: function () {
        var $draggable = $(".draggable.selected");
        var $rack = $(".rack.selected");
        if ($draggable.length > 0) {
            var $clonedDraggable = Product.DuplicateElement($draggable, true);
            if ($clonedDraggable) {
                Product.SelectHardware($clonedDraggable);
                Product.GetRackCalculationResults($clonedDraggable.closest(".rack-container"));
            }
        }
        else if ($rack) {
            var rackCount = viewModel.SystemConfig.RackConfigs().length;

            if (rackCount > 19) {
                alert("No. of racks cannot exceed 20")
                return;
            }

            var $clonedRack = Product.DuplicateRack($rack);
            Product.SelectRack($clonedRack.find(".rack"));
        }
    },

    onSaveClick: function () {
        var $draggable = $(".draggable.selected");
        var $rack = $(".rack.selected");

        if ($draggable.length > 0) {
            var hardwareConfig = $draggable.data("hardwareConfig");
            var hardware = $draggable.data("hardware");
            var slotHardwareConfigs = [];
            slotHardwareConfigs = Product.SaveModules($draggable);
            if (slotHardwareConfigs == undefined) {
                return;
            }

            hardwareConfig.HardwareConfigs.removeAll();
            if (slotHardwareConfigs.length > 0) {

                for (var q = 0; q < slotHardwareConfigs.length; q++) {
                    hardwareConfig.HardwareConfigs.push(new InnerHardwareConfig(slotHardwareConfigs[q]));
                }

                $draggable.find(".led").addClass("valid");
            }
            else {
                alert("Please select element and enter the quantity."); return;
                $draggable.find(".led").removeClass("valid");
            }

            $(".interactive-rack-row").addClass("collapsed-right");
            Product.GetRackCalculationResults($draggable.closest(".rack-container"));
        }
        else if ($rack) {
            var $rackContainer = $rack.closest(".rack-container");
            var rackConfig = $rackContainer.data("rackConfig");
            var name = $("#rackNameInput").val();

            rackConfig.Name(name);
            $(".interactive-rack-row").addClass("collapsed-right");
        }
    },

    onCancelClick: function () {
        $(".interactive-rack-row").addClass("collapsed-right");
        var len = $(".DriveQty").length;
        for (var k = 0; k < len ; k++) {
            $("#DriveQuantity" + k).val("");
            $("#DriveQuantity" + k).attr('disabled', true);
            $("#DriveSelection" + k).prop('selectedIndex', 0);
        }
    },

    onDetailsClick: function () {
        $("#close").show();
        var $draggable = $(".draggable.selected");
        var $rack = $(".rack.selected");

        if ($draggable.length > 0) {
            Product.ShowElementDetails($draggable);
            $(".interactive-rack-row").removeClass("collapsed-right");
        }
        else if ($rack.length > 0) {
            Product.ShowRackDetails($rack);
            $(".interactive-rack-row").removeClass("collapsed-right");
        }
    },

    onDeleteClick: function () {
        var $draggable = $(".draggable.selected");
        var $rack = $(".rack.selected");

        if ($draggable.length > 0) {
            var $droppable = $draggable.parent(".droppable");
            var hardwareConfig = $draggable.data("hardwareConfig");
            var rackConfig = $draggable.closest(".rack-container").data("rackConfig");

            Product.ToggleDroppable($droppable, true, hardwareConfig.RackUnits());

            rackConfig.HardwareConfigs.remove(hardwareConfig);
            Product.GetRackCalculationResults($draggable.closest(".rack-container"));
            $draggable.remove();
        }
        else if ($rack.length > 0) {
            var rackConfig = $rack.closest(".rack-container").data("rackConfig");

            viewModel.SystemConfig.RackConfigs.remove(rackConfig);
        }

        $(".interactive-rack-row").addClass("collapsed-right");
    },

    onZoomInClick: function () {
        if (currentZoom < 1.2) {
            currentZoom += 0.2;

            if (currentZoom == 1.0) {
                $(".interactive-rack-row").removeClass("zoom-level--1");
            }
            else if (currentZoom == 1.2) {
                $(".interactive-rack-row").addClass("zoom-level-2");
            }

            Product.AdjustElementPosition();
        }
    },

    onZoomOutClick: function () {
        if (currentZoom > 0.8) {
            currentZoom -= 0.2;

            if (currentZoom == 0.8) {
                $(".interactive-rack-row").addClass("zoom-level--1");
            }
            if (currentZoom == 1.0) {
                $(".interactive-rack-row").removeClass("zoom-level-2");
            }

            Product.AdjustElementPosition();
        }
    },

    onDownloadClick: function () {
        var imgName = "";
        html2canvas($("#racks"), {
            onrendered: function (canvas) {
                var imgName = "";
                if (viewModel.SystemConfig != {}) {
                    imgName = viewModel.SystemConfig.Name();
                }
                else {
                    imgName = "EMC PowerCalculator";
                }
                var doc = new jsPDF('p', 'mm', 'a4');
                var imgData = canvas.toDataURL('image/png', 1.0);

                doc.setFontSize(20);
                doc.text(70, 10, imgName);
                doc.addImage(imgData, 'PNG', 0, 0);
                doc.save('RackDownload.pdf');
            }
        });
    },

    onResetClick: function () {
        viewModel.SystemConfig.RackConfigs.removeAll();
        viewModel.SystemConfig.SiteId(0);
        viewModel.SystemConfig.Name("System Build 1");
        viewModel.SystemConfig.PhaseType(-1);
        viewModel.SystemConfig.OperatingTemperature(25);
        //viewModel.SystemConfig.ProductId = 0;
        $("#HardwareTypeDropDown").prop('selectedIndex', 0);
        $("#HardwareCategoryDropDown").prop('selectedIndex', 0);
        $("#RackTypeDropDown").prop('selectedIndex', 0);
        $(".interactive-rack-row").addClass("collapsed-right");
        $(".draggable-container").empty();
    },
    onNextClick: function () {
        var rackConfigs = viewModel.SystemConfig.RackConfigs();
        if (rackConfigs.length == 0) {
            alert("At least one rack should be added to the system.");
            return;
        }
        else {
            if (!Product.ValidateSystemName()) {
                alert('System name already exists. Please provide different name.');
                return;
            }

            var systemConfigJson = ko.toJSON(viewModel.SystemConfig);
            var $form = $("#dashboardPost");
            //$form.append({ buildConfig: jQuery.parseJSON(system1) });

            $form.find("#systemConfigPost").val(systemConfigJson);
            $form.submit();
        }
    },
    onDriveTypeDropDownChange: function (data, event) {
        var $target = $(data.currentTarget);
        var $driveTypeDropDown = $target.parent('div').find('input');
        if ($('option:selected', $target).index() > 0) {
            $driveTypeDropDown.attr('disabled', false);
        }
        else {
            $driveTypeDropDown.val(0);
            $driveTypeDropDown.attr('disabled', true);
            Product.onDriveQtyBlur();
        }
    },
    onDriveQtyBlur: function (data, event) {
        var totalCount = 0;
        var maxCount = parseInt($("#DAEDrive").val());
        var len = $(".DriveQty").length;
        for (var i = 0; i < len; i++) {
            if ($("#DriveQuantity" + i).val() != "") { totalCount += parseInt($("#DriveQuantity" + i).val()); }
        }
        if (totalCount > maxCount) {
            $("#currentAvailableSlot").text(0);
        }
        else {
            var availableCount = maxCount - totalCount;
            $("#currentAvailableSlot").text(availableCount)
        }
    },
    onDriveTypeQtyBlur: function (data, event) {
        var totalCount = 0;
        var maxCount = parseInt($("#DPEDrive").val());
        var len = $(".DriveQty").length;
        for (var i = 0; i < len; i++) {
            if ($("#DriveQuantity" + i).val() != "") {
                totalCount += parseInt($("#DriveQuantity" + i).val());
            }
        }
        if (totalCount > maxCount) {
            $("#dpeCurrentAvailableSlot").text(0);
        }
        else {
            var availableCount = maxCount - totalCount;
            $("#dpeCurrentAvailableSlot").text(availableCount)
        }
    },

    onDriveQtyFocus: function (data, event) {
        var x = parseInt(data.target.value);
        if (x == 0) {
            data.target.value = "";
        }
    },

    onDriveTypeQtyFocus: function (data, event) {
        var x = parseInt(data.target.value);
        if (x == 0) {
            data.target.value = "";
        }
    },

    onValidateSpeSanconnectivity: function () {
        var totalCount = 0;
        var maxCount = $(".moduleQty").closest(".slotType").attr('data-SlotCount');
        var IDArray = [];
        $(".moduleQty").each(function (data, value) {
            var Id = $(this).attr('id');
            IDArray.push(Id);
        });
        var len = IDArray.length;
        for (var i = 0; i < len; i++) {
            totalCount += parseInt($("#" + IDArray[i]).val());
        }
        var available = maxCount - totalCount;

        for (var i = 0; i < len; i++) {
            var value = parseInt($("#" + IDArray[i]).val());
            var dropDownCapacity = value + available;
            $("#" + IDArray[i]).find("option").remove();

            for (var j = 0; j <= dropDownCapacity; j += 1) {
                $("#" + IDArray[i]).append($("<option/>").attr("value", j).text(j));
            }
            $("#" + IDArray[i]).val(value);
        }
    },

    onCancelProductClick: function () {
        bootbox.confirm({
            closeButton: false,
            message: "Any unsaved changes will be lost. Are you sure you want to leave this page?",
            callback: function (result) {
                if (!result) {
                    return;
                }

                window.location.href = urlActions.Dashboard;
            }
        });
    },

    CreateDraggableHardware: function (hardwareConfig, hardware) {
        var $draggableHardware = $('<div></div>');

        if (!hardwareConfig) {
            return $draggableHardware;
        }

        $draggableHardware.data("hardwareConfig", hardwareConfig);
        $draggableHardware.data("hardware", hardware);
        $draggableHardware.addClass("draggable").addClass("helper");
        $draggableHardware.css("background-color", hardwareConfig.ColorCode);

        var name = hardwareConfig.Name;
        var rackUnits = hardwareConfig.RackUnits();
        var nameParts = name.trim().split("\n");
        var $textContainer = $("<div></div>").addClass("hardware-text").appendTo($draggableHardware);

        for (var i = 0; i < nameParts.length; i++) {
            var part = nameParts[i];

            $("<div></div>").text(part.trim()).appendTo($textContainer);
        }

        $draggableHardware.draggable({
            cursor: "move",
            containment: ".product-page-section",
            revert: "invalid",
            stack: ".draggable",
            start: Product.onHardwareDragStart,
            stop: Product.onHardwareDragStop
        });

        // TODO: Auto calc height
        if (rackUnits == 1) {
            $draggableHardware.addClass("hardwareSmall");
        }
        else if (rackUnits == 2) {
            $draggableHardware.addClass("hardwareMedium");
        }
        else if (rackUnits > 2) {
            $draggableHardware.addClass("hardwareLarge");
        }

        return $draggableHardware;
    },

    DropHardware: function (hardwareConfig, $draggable, $droppable) {
        var position = $droppable.position();

        // Remove jQuery UI generated inline styles
        $draggable.removeAttr("style");

        $draggable.css("background-color", hardwareConfig.ColorCode);
        $draggable.css("position", "absolute");
        $draggable.css("top", position.top + 1)
        $draggable.css("left", position.left);

        if ($draggable.hasClass("helper")) {
            if (hardwareConfig.ModelType == "Enclosure") {
                $("<span></span>").addClass("led animate").appendTo($draggable);

                if (hardwareConfig.HardwareConfigs().length > 0) {
                    $draggable.find(".led").addClass("valid");
                }
            }

            $draggable.removeClass("hardwareSmall hardwareMedium hardwareLarge").removeClass("helper");
            $draggable.addClass("hardwareUnit" + hardwareConfig.RackUnits());

            if (hardwareConfig.RackUnits() == 1) {
                $draggable.find(".hardware-text").addClass("truncate");
            }

            $draggable.on("click", Product.onHardwareClick);
            $draggable.on("dblclick", Product.onEditClick);
        }

        $droppable.append($draggable);

        // TODO: Optimize
        // This removes highlted element color 
        //$(this).parent().find(".droppable").removeClass("highlightDroppable");
        //$(this).parent().find(".rack-unit").removeClass("highlightDroppable");
    },

    ToggleDroppable: function ($droppable, accept, rackUnits) {
        var droppableIndex = $droppable.data("slotIndex");

        for (var i = 0; i < rackUnits; i++) {
            var nextDroppableSelector = ".droppable[data-slot-index=" + (droppableIndex - i) + "]"; // TODO: Optimize
            var $nextDroppable = $droppable.parent().find($droppable.parent().find(nextDroppableSelector));

            if (accept) {
                $nextDroppable.droppable("option", "accept", ".draggable");
                $nextDroppable.removeClass("full");
                $nextDroppable.removeClass("drop-active");
            }
            else {
                $nextDroppable.droppable("option", "accept", "");
                $nextDroppable.addClass("full");
            }
        }
    },

    EnableAllDroppable: function () {
        $('.rack-container').each(function (index, obj) {
            var $innerDiv = $(obj);
            var $droppableList = $innerDiv.find(".droppable");

            $droppableList.each(function (index, obj) {
                var $droppable = $(obj);

                if ($droppable.hasClass("full")) {
                    return; // Continue
                }

                $droppable.droppable("option", "accept", ".draggable");
            });
        });
    },

    DisableAllDroppable: function (rackUnits) {
        $('.rack-container').each(function (index, obj) {
            var $innerDiv = $(obj);
            var $droppableList = $innerDiv.find(".droppable");

            $droppableList.each(function (index, obj) {
                var $droppable = $(obj);

                // Do not change anything for droppable where the element is already dropped
                if ($droppable.hasClass("full")) {
                    return; // Continue
                }

                var disableDrop = false;

                for (var i = 1; i < rackUnits; i++) {
                    var $nextDroppable = $droppableList.eq(index + i);

                    if ($nextDroppable.length == 0) {
                        disableDrop = true;
                        break;
                    }

                    var hasDraggable = $nextDroppable.find("div.draggable").length > 0;
                    var isActive = $nextDroppable.find("div.ui-draggable-dragging").length > 0;

                    // Do not consider droppable for current dragging element
                    if (hasDraggable && !isActive) {
                        disableDrop = true;
                        break;
                    }
                }

                if (disableDrop) {
                    $droppable.droppable("option", "accept", "");
                }
            });
        });
    },

    GetAvailableDroppable: function ($rack, rackUnits) {
        var $droppableList = $rack.find(".droppable");
        var $availableDroppable;

        $droppableList.each(function (index, obj) {
            var $droppable = $(obj);

            // Do not change anything for droppable where the element is already dropped
            if ($droppable.hasClass("full")) {
                return; // continue;
            }

            var disableDrop = false;

            for (var i = 1; i < rackUnits; i++) {
                var $nextDroppable = $droppableList.eq(index + i);

                if ($nextDroppable.length == 0) {
                    disableDrop = true;
                    break;
                }

                var hasDraggable = $nextDroppable.find("div.draggable").length > 0;
                var isActive = $nextDroppable.find("div.ui-draggable-dragging").length > 0;

                // Do not consider droppable for current dragging element
                if (hasDraggable && !isActive) {
                    disableDrop = true;
                    break;
                }
            }

            if (!disableDrop) {
                $availableDroppable = $droppable;
                return false; // break;
            }
        });

        return $availableDroppable;
    },

    SelectHardware: function ($draggable, unhide) {
        $(".draggable.selected").removeClass("selected");
        $draggable.addClass("selected");
        $(".rack.selected").removeClass("selected");

        if (unhide || !$(".interactive-rack-row").hasClass("collapsed-right")) {
            if (!$("#elementDetailSection").hasClass("hide") || !$("#rackDetailSection").hasClass("hide")) {
                Product.ShowElementDetails($draggable);
            }
            else {
                Product.EditElement($draggable, unhide);
            }
        }
    },

    SelectRack: function ($rack) {
        $(".rack.selected").removeClass("selected");
        $(".draggable.selected").removeClass("selected");
        $rack.addClass("selected");

        if (!$(".interactive-rack-row").hasClass("collapsed-right")) {
            if (!$("#elementDetailSection").hasClass("hide") || !$("#rackDetailSection").hasClass("hide")) {
                Product.ShowRackDetails($rack);
            }
            else {
                Product.EditRack($rack);
            }
        }
    },

    ShowEditSection: function ($section) {

        // Only reset classes if different element type is open.
        if ($section.hasClass("hide")) {

            // Hide all
            $(".detailSection").addClass("hide");

            // Show selected section
            $section.removeClass("hide");
            $("#editButtonSection").removeClass("hide");
        }
    },

    ShowDetailSection: function ($section) {

        // Only reset classes if different element type is open.
        if ($section.hasClass("hide")) {

            // Hide all
            $(".detailSection").addClass("hide");

            // Show selected section
            $section.removeClass("hide");
            $("#editButtonSection").addClass("hide");
        }
    },

    EditRack: function ($rack) {
        var $rackContainer = $rack.closest(".rack-container");
        var rackConfig = $rackContainer.data("rackConfig");

        Product.ShowEditSection($("#editRackSection"));

        $("#selectionName").text(rackConfig.Name());
        $("#rackNameInput").val(rackConfig.Name());
        $(".interactive-rack-row").removeClass("collapsed-right");
        $("#close").hide();
    },

    DuplicateRack: function ($rack) {
        var $rackContainer = $rack.closest(".rack-container");
        var rackConfig = $rackContainer.data("rackConfig");

        var rackConfigClone = viewModel.DuplicateRack(rackConfig);
        viewModel.SystemConfig.RackConfigs.push(rackConfigClone);

        // DOM auto updated by ko after observable array is updated.
        var $newRack = $('.rack-container').eq($("#racks > div").length - 1);
        var hardwareConfigs = rackConfigClone.HardwareConfigs();

        for (var i = 0; i < hardwareConfigs.length; i++) {
            var clone = hardwareConfigs[i];
            var rackUnits = clone.RackUnits();
            var $draggableHardware = Product.CreateDraggableHardware(clone);
            var $droppable = $newRack.find(".droppable[data-slot-index=" + (clone.Index()) + "]");

            Product.DropHardware(clone, $draggableHardware, $droppable);
            Product.ToggleDroppable($droppable, false, rackUnits);
        }

        return $newRack;
    },

    EditElement: function ($draggable, unhide) {
        var hardwareConfig = $draggable.data("hardwareConfig");
        var hardware = $draggable.data("hardware");

        if (hardwareConfig.ModelType != "Enclosure") {
            $(".interactive-rack-row").addClass("collapsed-right");
            return;
        }

        Product.ShowEditSection($("#editWindows"));
        Product.EditModule($draggable);

        if (unhide) {
            $(".interactive-rack-row").removeClass("collapsed-right");
        }
        $("#close").hide();
    },

    DuplicateElement: function ($draggable, unhide) {
        var hardwareConfig = $draggable.data("hardwareConfig");
        var hardware = $draggable.data("hardware");
        var $parentRackDiv = $draggable.closest(".rack-container");
        var rackConfig = $parentRackDiv.data("rackConfig");

        var rackUnits = hardwareConfig.RackUnits();
        var partId = hardwareConfig.PartId();

        var $droppable = Product.GetAvailableDroppable($parentRackDiv, rackUnits);

        if (!$droppable) {
            alert("No space available in Rack for selected element.");
            return false;
        }

        var index = $droppable.data("slot-index");
        var clone = hardwareConfig.Clone(index);
        var $draggableHardware = Product.CreateDraggableHardware(clone, hardware);
        Product.DropHardware(clone, $draggableHardware, $droppable);

        rackConfig.HardwareConfigs.push(clone);

        Product.ToggleDroppable($droppable, false, rackUnits);
        return $draggableHardware;
    },

    EditModule: function ($draggable) {
        var hardwareConfig = $draggable.data("hardwareConfig");
        Product.GetslotTypes(hardwareConfig.PartId);
        var hardware = $draggable.data("hardware");
        var totalDAEval = 0;


        
        $("#selectionName").text(hardwareConfig.Name);
        $("#availbleDrive").text(hardwareConfig.SlotFormFactor);

        var innerHardwareConfigs = hardwareConfig.HardwareConfigs();
        if (innerHardwareConfigs.length != 0) {
            for (var k = 0; k < innerHardwareConfigs.length; k++) {
                if (innerHardwareConfigs[k].Name() == "Module") {
                    var Index = innerHardwareConfigs[k].Index();
                    if (Index.length == undefined && Number(Index) < 10) {
                        Index = "0" + Index;
                    }

                    $("#ModuleQuantity" + Index).val(innerHardwareConfigs[k].Count());
                    $("#ModuleSelection" + Index).val(innerHardwareConfigs[k].PartId());
                }
                else if (innerHardwareConfigs[k].Name() == "DataMover") {
                    $("#DataMoverQuantity").val(innerHardwareConfigs[k].Count());
                    $("#DataMoverSelection").attr("value", innerHardwareConfigs[k].PartId());
                }
                else if (innerHardwareConfigs[k].Name() == "VaultModule") {
                    var Index = innerHardwareConfigs[k].Index() - 1;
                    $("#VaultQuantity" + Index).val(innerHardwareConfigs[k].Count());
                    $("#VaultSelection" + Index).val(innerHardwareConfigs[k].PartId());
                }
                else if (innerHardwareConfigs[k].Name() == "VaultDrive") {
                    var Index = innerHardwareConfigs[k].Index() - 1;
                    $("#DriveQuantity" + Index).val(innerHardwareConfigs[k].Count());
                    $("#DriveSelection" + Index).val(innerHardwareConfigs[k].PartId());
                }
                else {
                    var Index = innerHardwareConfigs[k].Index() - 1;
                    $("#DriveQuantity" + Index).val(innerHardwareConfigs[k].Count());
                    $("#DriveQuantity" + Index).attr('disabled', false);
                    $("#DriveSelection" + Index).val(innerHardwareConfigs[k].PartId());
                    if (hardware == undefined) {
                        totalDAEval += parseInt(innerHardwareConfigs[k].Count());
                    }
                }

            }
        }

        if (hardware != undefined) {
            for (var i = 0; i < hardware.SlotTypes.length; i++) {
                var slotType = hardware.SlotTypes[i];

                if (slotType.Category != null && slotType.Category == "Drive") {
                    $("#DAEDrive").val(hardwareConfig.SlotCapacity);
                    Product.onDriveQtyBlur();
                }
            }
        }
        else {
            $("#DAEDrive").val(hardwareConfig.SlotCapacity);
            var daeQtyVal = parseInt($("#DAEDrive").val());
            $("#currentAvailableSlot").text(daeQtyVal - totalDAEval);
        }
        if (hardwareConfig.HardwareConfigs().length == 0 && hardware.Category == "DME") {
            var slotHardwareConfig = Product.SaveBlankDME();
            hardwareConfig.HardwareConfigs.push(new InnerHardwareConfig(slotHardwareConfig));
        }
        Product.onValidateSpeSanconnectivity();
    },
    SaveBlankDME: function () {
        var slotHardwareConfig = new Object();
        slotHardwareConfig.PartId = $("#DataMoverSelection").attr('value');
        slotHardwareConfig.Count = $("#DataMoverQuantity").val();
        slotHardwareConfig.Name = "DataMover";
        slotHardwareConfig.Index = 0;
        return slotHardwareConfig;
    },
    SaveModules: function ($draggable) {
        var hardwareConfig = $draggable.data("hardwareConfig");
        var hardware = $draggable.data("hardware");
        var slotHardwareConfigs = [];

        /*Validation Section*/
        for (var j = 0; j < hardware.SlotTypes.length; j++) {
            var slotType = hardware.SlotTypes[j];
            if (slotType.Category != null && slotType.Category == "Module") {
                /*Module Validation Area Start*/
                for (var i = 0; i < slotType.MaxControls; i++) {
                    var str = "ModuleQuantity" + slotType.Id + i;

                    var qty = $("#ModuleQuantity" + slotType.Id + i).val();
                    var selection = $("#ModuleSelection" + slotType.Id + i).val();

                    if ((qty > 0 && selection == 0) || (qty == 0 && selection > 0)) {
                        alert("Please select element and enter the quantity.");
                        return;
                    }
                }
                /*Module Validation Area End*/
            }
            else if (slotType.Category != null && slotType.Category == "VaultModule") {
                /*ValutModule Validation Area Start*/
                for (var i = 0; i < slotType.MaxControls; i++) {

                    var qty = parseInt($("#VaultQuantity" + i).val());
                    var selection = parseInt($("#VaultSelection" + i).val());

                    if ((qty > 0 && selection == 0) || (qty == 0 && selection > 0)) {
                        alert("Please select element and enter the quantity.");
                        return;
                    }
                }
                /*ValutModule Validation Area End*/
            }
            else {
                /*Validation for drive start*/
                var maxCount = parseInt($("#DAEDrive").val());
                var totalCount = 0;
                var len = $(".DriveQty").length;
                for (var i = 0; i < len; i++) {
                    var qty = $("#DriveQuantity" + i).val();
                    if (qty != "") {
                        qty = parseInt(qty);
                        totalCount += qty;
                    }
                    var selection = parseInt($("#DriveSelection" + i).val());

                    if (((qty == "" || qty <= 0) && selection > 0) || (qty > 0 && selection == 0)) {
                        alert("Please select element and enter the quantity.");
                        return;
                    }
                }
                if (totalCount > maxCount) {
                    alert("No. of drives cannot exceed " + maxCount);
                    return;
                }
                /*Validation for drive end*/
            }
        }


        /*Saving Data*/
        $.each(hardware.SlotTypes, function (index, value) {
            var slotType = value;
            if (slotType.Category != null && slotType.Category == "Module") {
                if (slotType.SlotOptions.length == 1) {
                    var slotHardwareConfig = new Object();
                    slotHardwareConfig.PartId = $("#DataMoverSelection").attr('value');
                    slotHardwareConfig.Count = $("#DataMoverQuantity").val();
                    slotHardwareConfig.Index = 0;
                    slotHardwareConfig.Name = "DataMover";
                    slotHardwareConfigs.push(slotHardwareConfig);
                }
                else {
                    for (var i = 0; i < slotType.MaxControls; i++) {
                        var qty = $("#ModuleQuantity" + slotType.Id + i).val();
                        var selection = $("#ModuleSelection" + slotType.Id + i).val();

                        if (qty > 0 && selection > 0) {
                            var slotHardwareConfig = new Object();
                            slotHardwareConfig.PartId = $("#ModuleSelection" + slotType.Id + i).val();
                            slotHardwareConfig.Count = $("#ModuleQuantity" + slotType.Id + i).val();
                            slotHardwareConfig.Index = "" + slotType.Id + i;
                            slotHardwareConfig.Name = "Module";
                            slotHardwareConfigs.push(slotHardwareConfig);
                        }
                    }
                }

            }
            else if (slotType.Category != null && slotType.Category == "VaultModule") {
                for (var i = 0; i < slotType.MaxControls; i++) {
                    var qty = $("#VaultQuantity" + i).val();
                    var selection = $("#VaultSelection" + i).val();

                    if (qty > 0 && selection > 0) {
                        var slotHardwareConfig = new Object();
                        slotHardwareConfig.PartId = $("#VaultSelection" + i).val();
                        slotHardwareConfig.Count = $("#VaultQuantity" + i).val();
                        slotHardwareConfig.Index = i + 1;
                        slotHardwareConfig.Name = "VaultModule";
                        slotHardwareConfigs.push(slotHardwareConfig);
                    }
                }
            }
            else if (slotType.Category != null && slotType.Category == "VaultDrive") {
                for (var i = 0; i < slotType.MaxControls; i++) {
                    var Qty = $("#DriveQuantity" + i).val();
                    var Selection = $("#DriveSelection" + i).val();
                    var quantity = 0;
                    var slectionQuantity = 0;

                    if (Qty != "") {
                        quantity = parseInt(Qty);
                    }
                    if (Selection != "0") {
                        slectionQuantity = parseInt(Selection);
                    }

                    if ((Qty != "" || Selection != "0") && (quantity > 0 || slectionQuantity > 0)) {
                        var slotHardwareConfig = new Object();
                        slotHardwareConfig.PartId = $("#DriveSelection" + i).val();
                        slotHardwareConfig.Count = $("#DriveQuantity" + i).val();
                        slotHardwareConfig.Index = i + 1;
                        slotHardwareConfig.Name = "VaultDrive";
                        slotHardwareConfigs.push(slotHardwareConfig);
                    }
                }
            }
            else {
                var len = $(".DriveQty").length;
                var maxNo = slotType.MaxControls;
                for (var i = len - maxNo; i < len; i++) {

                    var Qty = $("#DriveQuantity" + i).val();
                    var Selection = $("#DriveSelection" + i).val();
                    var quantity = 0;
                    var slectionQuantity = 0;

                    if (Qty != "") {
                        quantity = parseInt(Qty);
                    }
                    if (Selection != "0") {
                        slectionQuantity = parseInt(Selection);
                    }

                    if ((Qty != "" || Selection != "0") && (quantity > 0 || slectionQuantity > 0)) {
                        var slotHardwareConfig = new Object();
                        slotHardwareConfig.PartId = $("#DriveSelection" + i).val();
                        slotHardwareConfig.Count = $("#DriveQuantity" + i).val();
                        slotHardwareConfig.Index = i + 1;
                        slotHardwareConfigs.push(slotHardwareConfig);
                    }

                }
            }

        });

        return slotHardwareConfigs;
    },
    ShowElementDetails: function ($draggable) {
        var hardwareConfig = $draggable.data("hardwareConfig");

        $("#selectionName").text(hardwareConfig.Name);
        Product.GetElementCalculationResults($draggable);
        Product.ShowDetailSection($("#elementDetailSection"));
    },

    ShowRackDetails: function ($rack) {
        var rackHeader = $rack.find(".rack-header");
        var $rackDetail = $rack.closest(".rack-container").find(".rack-detail-table");
        var $detailSection = $("#rackDetailSection");

        $("#selectionName").text(rackHeader.text());

        $detailSection.find(".powerConsumptionValue").text($rackDetail.find(".powerConsumptionValue").text());
        $detailSection.find(".heatDissipationValue").text($rackDetail.find(".heatDissipationValue").text());
        $detailSection.find(".annualizedEnergyCostValue").text($rackDetail.find(".annualizedEnergyCostValue").text());
        $detailSection.find(".weightValue").text($rackDetail.find(".weightValue").text());

        Product.ShowDetailSection($detailSection);
    },

    GetElementCalculationResults: function ($draggable) {
        var hardwareConfig = $draggable.data("hardwareConfig");
        var hwdConfig = ko.toJSON(hardwareConfig);
        var sysConfig = ko.toJSON(viewModel.SystemConfig);

        $.ajax({
            url: urlActions.CalculateElement,
            dataType: "json",
            type: "POST",
            data: {
                hardwareConfig: jQuery.parseJSON(hwdConfig), systemConfig: jQuery.parseJSON(sysConfig)
            },
            success: function (data) {
                $("#InputWattsValue").html(data.NormalMode.PowerInWatts);
                $("#InputVAValue").html(data.NormalMode.PowerInVolts);
                $("#PeakInrushCurrentValue").html(data.PowerInterface.PeakInRushCurrents[0]);
                $("#SoundPressureValue").html(data.Physical.SoundPressure);
                $("#SoundPowerValue").html(data.Physical.SoundPower);
                $("#WeightValue").html(data.Physical.Weight);
                $("#ChassisSizeValue").html(data.Physical.RackUnits);
            },
            error: function (jqXhr) {
                if (DEBUG) {
                    alert(jqXhr.responseText);
                }
                else {
                    alert("Error occured while getting element details.")
                }
            }
        });
    },

    GetRackCalculationResults: function ($rack) {
        var rackConfig = $rack.data("rackConfig");
        var sysObjStr = ko.toJSON(viewModel.SystemConfig);
        var rackObj = ko.toJSON(rackConfig);

        $.ajax({
            url: urlActions.CalculateRack,
            dataType: "json",
            type: "POST",
            data: {
                rackconfig: jQuery.parseJSON(rackObj), systemConfig: jQuery.parseJSON(sysObjStr)
            },
            success: function (data) {
                $rack.find(".powerConsumptionValue").html(data.NormalMode.PowerConsumption);
                $rack.find(".heatDissipationValue").html(data.NormalMode.HeatDissipation);
                $rack.find(".annualizedEnergyCostValue").html(data.NormalMode.AnnualizedEnergyCost);
                $rack.find(".weightValue").html(data.Physical.Weight);
            },
            error: function (jqXhr) {
                if (DEBUG) {
                    alert(jqXhr.responseText);
                }
                else {
                    alert("Error occured while getting rack details.")
                }
            }
        });
    },

    onDroppableOut: function (event, ui) {
        var index = $(this).data('index');
        var lastIndex = parseInt($(this).parent().data("hoverIndex"));
        var unit = parseInt($(this).parent().data("hoverUnit"));

        if (unit > 1) {
            if (index == lastIndex + 1) {
                $(this).addClass("highlightDroppable");
                $(this).prev().addClass("highlightDroppable");
            }
            else {
                for (var i = 1; i < 3; i++) {
                    $(this).parent().find(".droppable:eq(" + (lastIndex + i) + ")").removeClass("highlightDroppable");
                    $(this).parent().find(".rack-unit:eq(" + (lastIndex + i) + ")").removeClass("highlightDroppable");
                }

                $(this).prev().removeClass("highlightDroppable");
            }
        }
        else {
            $(this).prev().removeClass("highlightDroppable");
        }
    },

    onDroppableOver: function (event, ui) {
        // var id = ui.draggable.attr('id');
        var index = $(this).data('index');
        var hardwareConfig = ui.draggable.data("hardwareConfig");
        var rackUnit = hardwareConfig.RackUnits();

        if (rackUnit > 1) {
            for (var i = 1; i < rackUnit; i++) {
                $(this).parent().find(".droppable:eq(" + (index + i) + ")").addClass("highlightDroppable");
                $(this).parent().find(".rack-unit:eq(" + (index + i) + ")").addClass("highlightDroppable");
            }

            for (var j = i; j < 6; j++) {
                $(this).parent().find(".droppable:eq(" + (index + j) + ")").removeClass("highlightDroppable");
                $(this).parent().find(".rack-unit:eq(" + (index + j) + ")").removeClass("highlightDroppable");
            }
        }

        $(this).parent().data("hoverIndex", index);
        $(this).parent().data("hoverUnit", rackUnit);
        $(this).prev().addClass("highlightDroppable");
    },

    AdjustElementPosition: function () {
        $(".rack-container").find('.draggable').each(function (index, obj) {
            var hardwareConfig = $(this).data("hardwareConfig");
            var index = hardwareConfig.Index();
            var innerRackDiv = $(this).closest('.rack-container');
            var droppableObjects = innerRackDiv.find(".droppable");
            var calculatedIndex = droppableObjects.length - index;
            var objContainer = droppableObjects.eq(calculatedIndex);
            var newPosition = objContainer.position();

            $(this).css({
                position: 'absolute', top: (newPosition.top + 1), left: newPosition.left
            });
        });
    },

    ParseSystemConfig: function (currentSystemConfig) {
        viewModel.SystemConfig.Name(currentSystemConfig.Name);
        viewModel.SystemConfig.ProductId = currentSystemConfig.ProductId;
        viewModel.SystemConfig.Id = currentSystemConfig.Id;
        viewModel.SystemConfig.SiteId(currentSystemConfig.SiteId);
        viewModel.SystemConfig.PhaseType(currentSystemConfig.PhaseType);
        viewModel.SystemConfig.OperatingTemperature(currentSystemConfig.OperatingTemperature);

        for (var i = 0; i < currentSystemConfig.Racks.length; i++) {
            var rackConfig = currentSystemConfig.RackConfigs[i];
            var rack = currentSystemConfig.Racks[i];
            var rackId = rackConfig.Id;
            var Name = rackConfig.Name;
            var partId = rackConfig.PartId;
            var rackunitcapacity = rack.RackUnitCapacity;
            var newRackConfig = new RackConfig(rackId, Name, partId, rackunitcapacity);
            var hardwares = rack.Hardwares;
            var hardwareConfigs = rackConfig.HardwareConfigs;

            // Add clones before updating observable array in order get rack calculation results
            for (var j = 0; j < hardwares.length; j++) {
                var hardware = hardwares[j];
                var hardwareConfig = hardwareConfigs[j];
                var index = hardwareConfig.Index;
                var partId = hardwareConfig.PartId;
                var rackUnits = hardware.RackUnits;

                var clone = new HardwareConfig(index, partId, hardwareConfig.Count, rackUnits);
                clone.Id = hardwareConfig.Id;
                clone.Name = hardware.FormattedText;
                clone.ModelType = hardware.ModelType;
                clone.Category = hardware.Category;
                clone.SlotCapacity = hardware.SlotCapacity;
                clone.SlotFormFactor = hardware.SlotFormFactor;
                clone.ColorCode = hardware.ColorCode;

                var slotHardwareConfigs = hardwareConfig.HardwareConfigs;

                for (var h = 0; h < slotHardwareConfigs.length; h++) {
                    clone.HardwareConfigs.push(new InnerHardwareConfig(slotHardwareConfigs[h]));
                }

                newRackConfig.HardwareConfigs.push(clone);
            }

            viewModel.SystemConfig.RackConfigs.push(newRackConfig);
            Product.ReadHardwareConfig(newRackConfig, rack);
        }
    },

    ReadHardwareConfig: function (newRackConfig, rack) {
        var hardwareConfigs = newRackConfig.HardwareConfigs();
        var hardwares = rack.Hardwares;
        var $newRack = $('.rack-container').eq($("#racks > div").length - 1);

        for (var i = 0; i < hardwareConfigs.length; i++) {
            var hardwareConfig = hardwareConfigs[i];
            var hardware = hardwares[i];
            var rackUnits = hardwareConfig.RackUnits();
            var $droppable = $newRack.find(".droppable[data-slot-index=" + (hardwareConfig.Index()) + "]");

            var $draggableHardware = Product.CreateDraggableHardware(hardwareConfig, hardware);
            Product.DropHardware(hardwareConfig, $draggableHardware, $droppable);
            Product.ToggleDroppable($droppable, false, rackUnits);
        }          
    },

    ValidateSystemName: function () {
        var sysConfig = ko.toJSON(viewModel.SystemConfig);
        var isValid;

        $.ajax({
            url: urlActions.ValidateSystemName,
            dataType: "text",
            type: "POST",
            async: false,
            data: {
                systemConfig: jQuery.parseJSON(sysConfig)
            },
            success: function (data) {
                isValid = (data === "True" || data === "true");
            },
            error: function (jqXhr) {
                if (DEBUG) {
                    alert(jqXhr.responseText);
                }
                else {
                    alert("Error occured while getting element details.")
                }
            }
        });

        return isValid;
    },
    GetslotTypes: function (PartId) {
        var ProductId = viewModel.SystemConfig.ProductId;
        $.ajax({
            type: "POST",
            url: urlActions.GetSlotType,
            async: false,
            data: {
                partId: PartId,
                productId: parseInt($("#productId").val())
            },
            success: function (html) {
                $("#editWindows").html(html);
                $(".DriveSelection").on("change", Product.onDriveTypeDropDownChange);
                $(".DriveQty").on("keyup", Product.onDriveQtyBlur);
                $(".VaultQty").on("change", Product.onDriveQtyBlur);
                $(".DrivetxtBx").on("focus", Product.onDriveQtyFocus);
                $(".moduleQty").on("change", Product.onValidateSpeSanconnectivity);
            },
            error: function (jqXhr) {
                if (DEBUG) {
                    alert(jqXhr.responseText);
                }
                else {
                    alert("Error occured while saving configuration.");
                }
            }
        });
    }
};

$(document).ready(function () {

    Product.init();
});