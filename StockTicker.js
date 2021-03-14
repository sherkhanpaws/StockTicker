// ==UserScript==
// @name         Stock Ticker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stock Ticker
// @author       You
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        GM_xmlhttpRequest
//@grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
          //  element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}
function unfade(element) {
    var op = 0.1;  // initial opacity
  //  element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function fetch_stock_id() {

     GM_xmlhttpRequest ( {
                method:     'GET',
                url:        'https://api.torn.com/torn/?selections=stocks&key=StfK2QkPRLrc017M',
                onload:     function (responseDetails) {
                    let responseText = responseDetails.responseText;
                    console.log(responseText);
                   // alert(responseDetails.responseText);
                    let stock_ids = Object.keys(JSON.parse(responseText).stocks);
                    stock_ids.forEach(update_stock_values);
                }
            });

}
function update_stock_values (id) {

     GM_xmlhttpRequest ( {
                method:     'GET',
                url:        'https://api.torn.com/torn/'+id+'?selections=stocks&key=API_KEY',
                onload:     function (responseDetails) {
                    let responseText = responseDetails.responseText;
                    console.log(responseText);
                    let stock_data = JSON.parse(responseText);
                    let local_stock_string = GM_getValue("stock_ticker");
                    if(!local_stock_string) { local_stock_string = "{}" };
                    let local_stock_data = JSON.parse(local_stock_string);
                    console.log("Local Data");
                    console.log(local_stock_data);
                    console.log("Remote Data");
                    console.log(stock_data);
                    local_stock_data[id] = stock_data.stocks[id];

                    GM_setValue("stock_ticker",JSON.stringify(local_stock_data));
                }
            });

}
async function update_ticker() {
    var stock_id = 1;
      setInterval(function (){
         let stock_data = JSON.parse(GM_getValue("stock_ticker"));
         let stock_keys = Object.keys(stock_data);
         console.log(Object.keys(stock_data).length);
        let stock = stock_data[stock_keys[stock_id]];
         console.log(stock);
        var stocks_info = document.getElementById("stocks_info");
         stocks_info.innerHTML=stock.acronym+"("+stock.current_price+")"+stock.history[0].change;
          if (stock_id==Object.keys(stock_keys).length-1) { stock_id=1} else {stock_id++};
        },(2000));
}




(function() {
    'use strict';
var sb = document.getElementById("sidebar");
var stock_ticker = document.createElement("div");
stock_ticker.className = "sidebar-block___1Cqc2 tt-nav-section";
var ticker_content = "<div class='content___kMC8x'><div class='tt-title title-green'><div class='title-text'>Stock Ticker</div></div><div class='toggle-content___3YEYV tt-content' id='stocks_info'>Stocks INFO will be here</div></div></div>";
stock_ticker.innerHTML = ticker_content;
sb.insertBefore(stock_ticker,sb.children[1]);
var stocks_info = document.getElementById("stocks_info");
 //stocks_info.innerHTML=GM_getValue("stock_ticker");
stock_ticker.addEventListener("click",fetch_stock_id);
setInterval(unfade,2000,stocks_info);
setTimeout(function () {setInterval(fade,2000,stocks_info)},1000);
update_ticker();
})();
