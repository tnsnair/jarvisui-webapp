var Configuration = {

    init: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        $(".delete-icon").on("click", this.OnDeleteIconClick);
        $("#deleteButton").on("click", this.OnDeleteButtonClick);
    },

    OnDeleteIconClick: function () {
        var id = $(this).data('assigned-id');
        $("#deleteButton").data('assigned-config-id', id);
    },

    OnDeleteButtonClick: function () {
        var id = $(this).data('assigned-config-id');

        $.ajax({
            url: urlActions.Delete,
            dataType: "text",
            type: "POST",
            data: { configurationId: (id) },
            success: function (data) {
                window.location = urlActions.Index;
            },
            error: function (jqXhr) {
                if (DEBUG) {
                    alert(jqXhr.responseText);
                }
                else {
                    alert("Error occured while getting element details.")
                }
            }
        })
    }
}

$(document).ready(function () {
    Configuration.init();
});




