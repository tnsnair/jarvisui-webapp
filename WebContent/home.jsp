<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>Jarvis Support Portal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="apple-touch-icon" href="apple-touch-icon.png"/>

    <style>
        #gallery .thumbnail {
            width: 150px;
            height: 150px;
            float: left;
            margin: 2px;
        }

        #gallery .thumbnail img {
            width: 150px;
            height: 150px;
        }
    </style>

    <link rel="stylesheet" type="text/css" href="css/dashboard.css" />
    <link rel="stylesheet" type="text/css" href="content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="css/Product.css" />
    <link rel="stylesheet" type="text/css" href="css/Site.css" />
    <link rel="stylesheet" type="text/css" href="css/icons.css" />
    <link rel="stylesheet" type="text/css" href="css/configuration.css" />
    <link rel="stylesheet" type="text/css" href="css/SiteManager.css" />
    <link rel="stylesheet" type="text/css" href="css/Help.css" />
    <link rel="stylesheet" type="text/css" href="css/LicenseDisclaimer.css" />
    <link rel="stylesheet" type="text/css" href="content/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="css/chatbox.css" />
    <!--<script language="javascript" type="text/javascript" src="Javascript/TopBanner.js"></script>-->
    <script language="javascript" type="text/javascript" src="scripts/jquery-2.2.0.js"></script>
    <script language="javascript" type="text/javascript" src="scripts/html2canvas.js"></script>
    
    <script language="javascript" type="text/javascript" src="scripts/jquery-ui-1.11.4.js"></script>
    <script language="javascript" type="text/javascript" src="scripts/jquery-ui-touch-punch.js"></script>
    <script language="javascript" type="text/javascript" src="scripts/bootbox.js"></script>
    <script language="javascript" type="text/javascript" src="scripts/bootstrap.js"></script>
    <script language="javascript" type="text/javascript" src="js/Configuration.js"></script>
    <!--<script language="javascript" type="text/javascript" src="js/Dashboard.js"></script>-->
    <script language="javascript" type="text/javascript" src="js/License.js"></script>
    <script language="javascript" type="text/javascript" src="js/Product.js"></script>
    <script language="javascript" type="text/javascript" src="js/Site.js"></script>
    <script language="javascript" type="text/javascript" src="js/SiteManager.js"></script>
    <script>
        var elementList = "";
    </script>
    
    
    
    <script language="javascript" type="text/javascript">
        $(function () {
            $("#addClass").click(function () {
                $('#qnimate').addClass('popup-box-on');
                $('#qnimateButton').removeClass('popup-box-on');
                
            });

            $("#removeClass").click(function () {
                $('#qnimate').removeClass('popup-box-on');
                $('#qnimateButton').addClass('popup-box-on');
            });

            $("#addClassChat").click(function () {
                $('#qnimate').addClass('popup-box-on');
                $(".navbar-side").toggle();
                $('#hamburgerIcon').toggleClass("active");
                $('#qnimateButton').removeClass('popup-box-on');
            });
                 
        })

       

    </script>
</head>
<body>
    <!--<form id="frmdashboard" method="post" enctype="multipart/form-data" action="http://10.4.109.63:8080/upload">-->
        <!--<form method="POST" enctype="multipart/form-data" action="http://10.4.109.63:8080/upload">-->
           <form>
            <div class="layout-container">
                <header class="fixed-header">
                    <nav class="nav-brand">
                        <h3 class="nav-logo">
                            <a href="Dashboard.html">
                                <!--<img src="~/Images/dell_emc_logo.png" alt="DELL EMC Logo" height="30" width="171" style="padding-right:15px;" />-->
                                <img src="images/jarvis.jpg" alt="DELL EMC Logo" height="35" width="50" style="padding-right:15px;" />
                                Jarvis Support Portal  <small>v1.0</small>
                            </a>
                        </h3>
                    </nav>

                    <nav class="nav-user-controls">
                        <div class="nav-left">
                            <a id="hamburgerIcon" href="#" class="hamburger">
                                <span class="animate"></span>
                                <span class="animate"></span>
                                <span class="animate"></span>
                            </a>
                            <h4 class="nav-page-name">Dashboard</h4>
                        </div>


                        <div class="nav-right">
                            <div class="dropdown nav-user">
                                <a class="dropdown-toggle" aria-expanded="true" aria-haspopup="true" role="button" data-toggle="dropdown" href="#">
                                    Welcome Administrator
                                    <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="sign-out">Sign Out</a>
                                    </li>
                                </ul>
                                <img src="images/profile.png" alt="Avatar" />
                            </div>
                        </div>
                    </nav>

                    <nav class="navbar-side-collapse">
                        <ul class="nav navbar-inverse navbar-side">
                            <li>
                                <!--@Html.ActionLink("Dashboard", "Index", "Dashboard",
                            null, null, "", null, new { @class = "icon dashboard-icon" }
                            )-->
                                <a class="icon dashboard-icon" href="Dashboard.html" id="dashboard">Dashboard</a>
                            </li>
                            <!--<li>
                            <a class="icon help-icon" href="Dashboard.html" id="help">View Service Requests</a>
                        </li>-->
                            <li>
                                <a class="icon chat-icon" href="#" id="addClassChat">Open in chat</a>

                            </li>
                            <li>
                                <!--@Html.ActionLink("Help", "Index", "Help",
                            null, null, "", null, new { @class = "icon help-icon" }
                            )-->
                                <a class="icon help-icon" href="Dashboard.html" id="help">Help</a>
                            </li>
                        </ul>
                    </nav>
                </header>

                <div class="section-container">
                    <div class="container-fluid section-page">


                        <div id="pnlEnvironmentData" class="panel panel-primary">
                            <div data-collapsed="true" class="panel-heading animate clickable" data-toggle="collapse" href="#powerSummaryPanel">
                                <h3 class="panel-title">
                                    Dashboard
                                    <span class="fa fa-angle-double-down fa-2x pull-right"></span>
                                </h3>

                            </div>

                            <div class="panel-body">
                                <div class="panel-group">

                                    <div class="panel panel-primary collapsible">
                                        <div class="panel-heading clickable animate" data-toggle="collapse" href="#powerSummaryPanel">
                                            <h4 class="panel-title">
                                                Upload File (img/txt/log)
                                                <span class="fa fa-chevron-up fa-lg fa-rotate-180 animate pull-right"></span>
                                            </h4>
                                        </div>
                                        <div id="powerSummaryPanel" class="panel-collapse collapse">
                                            <div class="panel-body">
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div>
                                                            <div>
                                                                <table>
                                                                    <tr><td>File to upload:</td><td><input id="fileinput" type="file" name="file" /></td></tr>
                                                                    <!--<tr><td></td><td><br /><input type="submit" value="Upload" /></td></tr>-->
                                                                </table>



                                                                <!--<input type="file" id="fileinput" multiple="multiple" accept="image/*" />-->
                                                                <div id="gallery"></div><br /><br /><br />

                                                                <label id="lblfilename"></label>&nbsp;&nbsp;<label id="lblfilesize"></label>&nbsp;&nbsp;<label id="lblfiletype"></label>
                                                                <!--<button id="btnSubmit" type="submit">Submit</button>-->
                                                                <script>

                                                                    var uploadfiles = document.getElementById("fileinput"); //document.querySelector('#fileinput');
                                                                    uploadfiles.addEventListener('change', function () {
                                                                        var files = this.files;
                                                                        for (var i = 0; i < files.length; i++) {
                                                                            previewImage(this.files[i]);
                                                                        }

                                                                    }, false);


                                                                    function previewImage(file) {

                                                                        document.getElementById("lblfilename").innerHTML = "Name: " + file.name;
                                                                        document.getElementById("lblfilesize").innerHTML = "Size: " + file.size + "Bytes";
                                                                        document.getElementById("lblfiletype").innerHTML = "Type: " + file.type;


                                                                        var galleryId = "gallery";

                                                                        var gallery = document.getElementById(galleryId);
                                                                        var imageType = /image.*/;

                                                                        if (!file.type.match(imageType)) {
                                                                            throw "File Type must be an image";
                                                                        }

                                                                        var thumb = document.createElement("div");
                                                                        thumb.classList.add('thumbnail'); // Add the class thumbnail to the created div

                                                                        var img = document.createElement("img");
                                                                        img.file = file;
                                                                        thumb.appendChild(img);
                                                                        gallery.appendChild(thumb);

                                                                        // Using FileReader to display the image content
                                                                        var reader = new FileReader();
                                                                        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
                                                                        reader.readAsDataURL(file);


                                                                        var url = "http://10.4.109.63:8080/upload";
                                                                        var xhr = new XMLHttpRequest();
                                                                        var fd = new FormData();
                                                                        xhr.open("POST", url, true);
                                                                        
                                                                        xhr.onreadystatechange = function () {
                                                                            
                                                                            if (xhr.readyState == 4 && xhr.status == 200) {
                                                                                // Every thing ok, file uploaded
                                                                                console.log(xhr.responseText); // handle response.
                                                                                alert("File uploaded successfully. "+xhr.responseText); // handle response.
                                                                            }
                                                                        };
                                                                        fd.append("file", file);
                                                                        xhr.send(fd);
                                                                        
                                                                    }



                                                                </script>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel panel-primary collapsible">
                                        <div class="panel-heading clickable animate" data-toggle="collapse" href="#powerInterfacePanel">
                                            <h4 class="panel-title">
                                                View Summary
                                                <span class="fa fa-chevron-up fa-lg fa-rotate-180 animate pull-right"></span>
                                            </h4>
                                        </div>
                                        <div id="powerInterfacePanel" class="panel-collapse collapse">
                                            <div class="panel-body">
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div class="col-xs-6" style="width:980px">
                                                            <table class="table table-condensed table-no-border">
                                                                <tbody>
                                                                    <tr>
                                                                        Summary UI here

                                                                    </tr>

                                                                </tbody>
                                                            </table>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>



                            <!--<div class="panel-body_Deleted">
                                <div id="powerSummaryPanel" >
                                    <iframe width="350" height="430" src="https://console.api.ai/api-client/demo/embedded/5beca097-fad4-4b60-bc74-8564a4fae2b9"></iframe>

                                </div>


                        </div>-->


                        </div>


                    </div>
                </div>




                <div class="popup-box chat-popup nav-brand" id="qnimate"><h4 class="nav-page-name">Jarvis Support Bot</h4>
                    <button data-widget="remove" id="removeClass" class="chat-header-button pull-right" type="button"><i class="glyphicon glyphicon-remove"></i></button>
                    <div class="popup-head nav-brand">
                        <div id="powerSummaryPanel1">
                            <!--<iframe width="335" height="430" src="https://console.api.ai/api-client/demo/embedded/5beca097-fad4-4b60-bc74-8564a4fae2b9"></iframe>-->
                            <!--<iframe width="335" height="430" src="apiai.html"></iframe>-->
                            <iframe width="350" height="430" src="https://console.api.ai/api-client/demo/embedded/dd7a1219-f49f-4fa1-b99d-e37e3a560620"></iframe>


                        </div>
                    </div>
                </div>


                <div class="popup-box-button popup-box-on" id="qnimateButton">
                    <div class="popup-head">
                        <div class="text-center">
                            <div class="row">
                                <div class="round hollow text-center">
                                    <a href="#" id="addClass"><span class="glyphicon glyphicon-comment"></span> Open in chat </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <footer>

                    <!--@Styles.Render("~/bundles/fontawesome")
                @RenderSection("Styles", required: false)
                @Scripts.Render("~/bundles/js/layout")
                @RenderSection("Scripts", required: false)-->
                </footer>
            </div>
        </form>
    
    <input id="licenceAccepted" type="hidden" data-value="@Model.IsLicenceAccepted">
</body>
</html>
