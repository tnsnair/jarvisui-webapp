<!DOCTYPE html>
<!-- saved from url=(0084)https://console.api.ai/api-client/demo/embedded/5beca097-fad4-4b60-bc74-8564a4fae2b9 -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta name="referrer" content="no-referrer"/><title>CustomerSupportBot</title><link rel="icon" type="image/png" href="images/jarvis.jpg"><meta property="og:title" content="CustomerSupportBot"/><meta property="og:description" content=""/><meta property="og:locale" content="en"/><meta property="og:image" content=""/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>@-moz-keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}@-webkit-keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}@-ms-keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}#preloader{background:#fff;position:fixed;top:0;left:0;height:100%;width:100%;z-index:999999;opacity:1;-webkit-transition:opacity .5s ease;transition:opacity .5s ease}#preloader .logo{display:block;width:109px;height:39px;background-repeat:no-repeat;background-image:url(https://console.api.ai/api-client/assets/img/logo@2x-black.png);background-size:contain;position:absolute;top:50%;left:50%;margin:-20px 0 0 -55px;-moz-transition:all 1s ease-in-out;-webkit-transition:all 1s ease-in-out;-o-transition:all 1s ease-in-out;-ms-transition:all 1s ease-in-out;transition:all 1s ease-in-out;-moz-animation:blink normal 2s infinite ease-in-out;-webkit-animation:blink normal 2s infinite ease-in-out;-ms-animation:blink normal 2s infinite ease-in-out;animation:blink normal 2s infinite ease-in-out}noscript h1{padding:20px}</style><!--[if lte IE 7]>
    <script src="https://console.api.ai/api-client/js/agentDemoApp/promise.min.js"></script>
    <![endif]-->
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <script src="scripts/jquery.min.js"></script>
  <script src="js/ApiAiCustomScript.js"></script>
  <link href="css/ApiAi.css"  rel="stylesheet" type="text/css"/>
 </head>

<body>
  <div id="preloader" style="opacity: 0; display: none;">
    <noscript>&lt;h1&gt;This application does'not work without javascript&lt;/h1&gt;</noscript>
  <div class="logo"></div>
  </div>

<div class="b-agent-demo">
    <!--<div class="b-agent-demo_header1">
      <div class="b-agent-demo_header-icon">
      <div class="b-agent-demo_header-icon-align-helper">
      <img id="agent-avatar" src="Images/jarvis.jpg" srcset="Images/jarvis.jpg, Images/jarvis.jpg">
      </div>
      </div>
      <div class="b-agent-demo_header-wrapper1">
        <div class="b-agent-demo_header-agent-name">Jarvis Support Bot</div>
        <div class="b-agent-demo_header-description"></div>
      </div>
      </div>-->
      <!--<div class="b-agent-demo_powered_by">
        <a href="https://api.ai/" target="_blank"><img src="Images/apiai_logo-black.png"><span>Powered by</span></a>
      </div>-->
        <div class="b-agent-demo_result" id="resultWrapper">
          <table class="b-agent-demo_result-table"><tbody><tr><td id="result">
            <div id="userRequest" class="user-request">
                  <div class="user-request__text"></div>
            </div>
            <div id="spokenResponse" class="server-response">
                  <div class="spoken-response__text"></div>
            </div>

            <!--<div class="user-request">hi</div>
            <div class="server-response">Hi, I am your personal quick assistant. How can I assist you ?</div>-->
            
            </td>
            </tr>
            </tbody>
            </table>
            </div>
            <div class="clearfix"></div>
            <div class="b-agent-demo_input">

              <div id="agentDemoForm">
                <table>
                <tr>
              <td style="width:100%" >
              <input type="text" name="query" id="speech" placeholder="Ask something..."/>
              </td>
               <td style="width:100%">
              <button id="rec" class="btn">Speak</button>
              </td>
                </tr>
              </table>
              <!--<div class="b-agent-demo_input-microphone icon-mic" id="mic" style="display: block;"></div>-->
              
               <!--<div class="container">
                <input id="speech" type="text">
                <button id="rec" class="btn">Speak</button>
                <div id="spokenResponse" class="spoken-response">
                  <div class="spoken-response__text"></div>
                </div>
              </div>-->

            </div>
            <link href="https://fonts.googleapis.com/css?family=Titillium+Web:200" rel="stylesheet" type="text/css">
            </div>
            </div>

             
           
  </body>
  </html>