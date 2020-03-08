/* ----- Initialize api sdk ----- */
var apigClient = apigClientFactory.newClient();

$(document).ready(function () {
  var $messages = $(".messages-content"),
    date,
    minute,
    i = 0;

  /* ----- configure the user data ----- */
  var awsRegion = "us-east-1";
  var identityPoolId = "us-east-1:ef310e3b-5900-4bfd-9e23-5b7516600182";

  /* ----- Getting AWS credentials ----- */
  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = awsRegion;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  });

  /* ----- Exchange credentials ----- */

  //  initialize SDK with credentials to sign the API calls
  apigClient = apigClientFactory.newClient({
    accessKey: "ASIA2UJLLBTLABINX45I",
    secretKey: "eCPhtcSMcsLbfMx5R7BA9cbG0aV4C9DDGDFHhmkj",
    sessionToken:
      "FQoGZXIvYXdzEFEaDJVrey0zlvncfCKwxyL9ASrqpmffJ75nx8A0Q0okYyEkzrJRdJ5MXo0ZLB0PVkTx8uDmNyWVdnaNv2EBKmdARoyo2LBRdL9zEEslaWVFtRuWxrYzGXFmiV0iQ8/k0sZStBdesq1oG9xNDXTM4+VTb30hYi/XVZV0ngvXybehl/bh54dOl2quqckKsUowZ0v2yNmNocAQG+OE0X0VztIEEVjL4CilPXm1iVoMLD1tCYOi5E1BxT+A4q9KtAWSlyv6YwLIBy/KJVeJhPXwx8Sh1+wAPc0Py0wWaEkudvtsu8SadK84vXWipQhXM5nHCOXdx5D7SogEdzzH/cc4Uk7dg+K/yBy8GhV5hb6Xesko+Nej7AU="
  });

  /* ----- Display the chat interface ----- */
  $(".chat").removeClass("hide"); // display the chat box

  /* ----- Send welcome message ----- */
  $(window).load(function () {
    $(".messages-content").mCustomScrollbar();
    insertResponseMessage(
      "Hi I'm NONA, your personal shopping assistant. Let's Nona it!"
    );
  });

  /* ----- Update scrollbar ----- */
  function updateScrollbar() {
    $(".messages-content")
      .mCustomScrollbar("update")
      .mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 10,
        timeout: 0
      });
  }

  /* ----- Set current time ----- */
  function setDate() {
    date = new Date();
    if (minute != date.getMinutes()) {
      minute = date.getMinutes();
      $(
        '<div class="timestamp">' + date.getHours() + ":" + minute + "</div>"
      ).appendTo($(".message:last"));
    }
  }

  /* -----  Calling API----- */
  function callChatbotApi(message) {
    // The three parameters passed to api call are:
    // params, body, additionalParams
    // params and additionalParams = {}

    return apigClient.chatbotPost(
      {},
      {
        messages: [
          {
            type: "unstructured",
            unstructured: {
              text: message
            }
          }
        ]
      },
      {}
    );
  }

  function processMessage(message) {
    message = message.toLowerCase()
    let finished = false;
    if (message.includes('pale')) {
      finished = true;
    }
    else if (message.includes('medium')) {
      finished = true;
    }
    else if (message.includes('dark')) {
      finished = true;
    }

    if (message.includes('pale, medium or dark')) {
      finished = false;
      return;
    }

    if (finished) {
      let parts = message.split(" ");
      let name = parts[0];
      let sex = parts[1];
      let heightParts = parts[2].split("'");
      let inches = parseInt(heightParts[0]) * 12 + parseInt(heightParts[1]);
      let weight = parts[3];
      let tone = parts[4];
      window.open(`/save?name=${name}&body_height=${inches}&body_weight=${weight}&skin_tone=${tone}&sex=${sex}`);
    }
  }

  /* ----- Send the message to backend and display response ----- */
  function insertMessage() {
    msg = $(".message-input").val(); // grab the content that user inputs
    if ($.trim(msg) == "") {
      // if the input message is empty
      return false;
    }
    $('<div class="message message-personal">' + msg + "</div>")
      .appendTo($(".mCSB_container"))
      .addClass("new");
    //setDate();
    $(".message-input").val(null);

    updateScrollbar();
    callChatbotApi(msg) // call api to send msg
      .then(response => {
        console.log(response); // log the response
        var data = response.data; // get the response from backend

        if (data.messages && data.messages.length > 0) {
          console.log("received " + data.messages.length + " messages");

          var messages = data.messages;

          for (var message of messages) {
            if (message.type === "unstructured") {
              insertResponseMessage(message.unstructured.text); // display messaged sent back from backend
              processMessage(message.unstructured.text)
              console.log("backend start");
              console.log(message);
              console.log("backend end");
            } else {
              // only unstructured message type is supported
              console.log("not implemented");
            }
          }
        } else {
          // handle empty response
          insertResponseMessage(
            "Response message error. Please try again later."
          );
        }
      })
      .catch(error => {
        console.log("getting response error", error);
        insertResponseMessage("Cannot get reply now. Please try again later.");
      });
  }

  /* ----- Display response from backend ----- */
  function insertResponseMessage(content) {
    $(
      '<div class="message loading new"><figure class="avatar"><img src="/static/images/bot.png" /></figure><span></span></div>'
    ).appendTo($(".mCSB_container"));

    setTimeout(function () {
      $(".message.loading").remove();
      $(
        '<div class="message new"><figure class="avatar"><img src="/static/images/bot.png" /></figure>' +
        content +
        "</div>"
      )
        .appendTo($(".mCSB_container"))
        .addClass("new");
      //setDate();
      i++;
      updateScrollbar();
    }, 500);
  }

  // if the user hits submit button, call insertMessage
  $(".message-submit").click(function () {
    insertMessage();
  });

  // if the user hit "enter", call insertMessage
  $(window).on("keydown", function (e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  });
});
