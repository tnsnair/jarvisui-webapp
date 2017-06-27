// Globals

var productsCache = {};

var Site = {

    init: function () {
        this.bindEvents();

        var licenceAccepted = "True"; //$("#licenceAccepted").data('value');

        if (licenceAccepted == "True") {
            $("#hamburgerIcon").show();
            $(".nav-search").show();
            $("#versionDetails").show();
            $("#licensePageLink").hide();
            $("#separatorContactnLicenseLink").hide();
        }
        else {
            $("#hamburgerIcon").hide();
            $(".nav-search").hide();
            $("#versionDetails").hide();
            $("#separatorContactnDetails").hide();
            $("#licensePageLink").show();
        }

        $("#searchBox").autocomplete({
            source: this.onSearch,
            select: this.onAutoSuggestionSelected
        });
    },

    bindEvents: function () {
        $(".hamburger").on("click", this.onHamburgerClick);

        $(".collapsible")
            .on("show.bs.collapse", this.onCollapsibleShow)
            .on("hide.bs.collapse", this.onCollapsibleHide);

        $(".sign-out").on("click", this.onSignOutClick);
    },

    onHamburgerClick: function () {
        $(".navbar-side").toggle();
        $(this).toggleClass("active");
    },

    onCollapsibleShow: function (event) {
        Site.AddRotation(this);

        // Prevent parent collapsible
        event.stopPropagation();
    },

    onCollapsibleHide: function (event) {
        Site.RemoveRotation(this);

        // Prevent parent collapsible
        event.stopPropagation();
    },

    onSearch: function (request, response) {
        var term = request.term;

        if (!term)
            return;

        if (term in productsCache) {
            response(productsCache[term]);
            return;
        }

        $.ajax({
            type: "GET",
            url: $('#URLSource').data('get-products-url'),
            contentType: "application/json;",
            data: {
                term: term
            },
            success: function (products) {
                if (products.length > 0) {
                    productsCache[term] = products;
                    response(products);
                }
                else {
                    var result = [
                        {
                            label: 'No matches found',
                            value: term
                        }
                    ];

                    response(result);
                }
            }
        }).fail(Site.onAjaxError);
    },

    onAutoSuggestionSelected: function (event, data) {
        if (data.item.url) {
            location.href = data.item.url;
        }
    },

    onSignOutClick: function () {
        var w = confirm('Do you want to Sign Out? Press OK for Yes and Cancel for NO.');

        if (w == false) {
            return false;
        }

        $.ajax({
            url: $('#URLSource').data('signout-url'),
            type: "POST",
            dataType: "text",
            success: function (data) {
                window.location.href = data;
            }
        }).fail(Site.onAjaxError);
    },

    onAjaxError: function (jqXhr, exception) {
        var msg = '';

        if (jqXhr.status === 0) {
            msg = 'Unable to connect to server.';
        } else if (jqXhr.status == 404) {
            msg = '[404] Requested page not found.';
        } else if (jqXhr.status == 500) {
            msg = '[500] Internal Server Error.';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Request time out.';
        } else if (exception === 'abort') {
            msg = 'Request aborted.';
        } else {
            msg = 'Unknown Error.';
        }

        alert(msg);

        if (DEBUG) {
            console.log(jqXhr)
            console.log(exception)
        }
    },

    AddRotation: function (object) {
        $(object).find(".fa").first().removeClass("fa-rotate-180");
    },

    RemoveRotation: function (object) {
        $(object).find(".fa").first().addClass("fa-rotate-180");
    },
}

$(document).ready(function () {
    Site.init();
});
