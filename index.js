const url = "https://localhost:7276/";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(url + "offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

async function start() {
  console.log("inside start");
  try {
    await connection.start();
    console.log("inside try");

    const element = document.querySelector("#offerValue");
    $.get(url + "api/Offer", function (data, status) {
      console.log(data);
      element.innerHTML = "Begin price : " + data + "$";
    });
  } catch (err) {
    console.log("inside catch");
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

connection.on("ReceiveConnectInfo", (message) => {
  let element = document.querySelector("#info");
  // element.innerHTML = message;
});

// connection.on("ReciveWinnerMessage", (message, data) => {
//   let element = document.querySelector("#offerValue2");
//   element.innerHTML = message + "Offer " + data + "$";
//   bidButton.disabled = true;
//   timeSec.style.display = "none";
//   clearTimeout(interval);
// });

// connection.on("ReceiveBidUpdate", (newBid) => {
//   // When another user places a bid, reset the cooldown and enable the button
//   clearInterval(interval);
//   totalSeconds = 10;
//   bidButton.disabled = false;
//   timeSec.style.display = "none";
//   let offer = document.querySelector("#offerValue2");
//   offer.innerHTML = "New Offer: " + newBid + "$";
// });

var totalSeconds = 10;
var interval;
var timeSec = document.querySelector("#time-section");
var time = document.querySelector("#time");
var bidButton = document.querySelector("#button");

connection.on("ReciveMessage", (message, value) => {
  let element = document.querySelector("#offerResponse");
  element.innerHTML = message + value + "$";
  bidButton.disabled = true;
  clearTimeout(interval);
  totalSeconds = 10;

  timeSec.style.display = "block";
  time.style.display = "block";
});

function IncreaseOffer() {
  console.log("inside increase");
  let user = document.querySelector("#user");
  $.get(url + "api/Offer/Increase?data=100", function (data, status) {
    $.get(url + "api/Offer", function (data, status) {
      connection.invoke("SendMessage", user.value);
    });
  });
  interval = setInterval(async () => {
    time.innerHTML = totalSeconds;
    console.log("inside interval");
    if (totalSeconds == 0) {
      bidButton.disabled = false;

      clearTimeout(interval);
    }
    --totalSeconds;
  }, 1000);
}
