function stockTicker() {

    let ticker = document.getElementById('ticker').value;
    ticker = ticker.toUpperCase();

    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=2X8AHKH6M7SLGS8H`;

    let urlName = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=2X8AHKH6M7SLGS8H`;

    fetch(url).then(function(stockData) {
        stockData.json().then(function(data) {
    
            if( data['Meta Data'] ) {
                document.querySelector('.tickerDoesNotExist').innerHTML = "";

                let lastRefresh = data['Meta Data']['3. Last Refreshed'];
                let tickerName = data['Meta Data']['2. Symbol'];
                let openPrice = data['Time Series (1min)'][lastRefresh]['1. open'];
                let highPrice = data['Time Series (1min)'][lastRefresh]['2. high'];
                let lowPrice = data['Time Series (1min)'][lastRefresh]['3. low'];
                let closePrice = data['Time Series (1min)'][lastRefresh]['4. close'];
                let volume = data['Time Series (1min)'][lastRefresh]['5. volume'];
    
                openPrice = Number( openPrice ).toFixed(2);
                lowPrice = Number( lowPrice ).toFixed(2);
                highPrice = Number( highPrice ).toFixed(2);
                closePrice = Number( closePrice ).toFixed(2);

                //Convert date from UTC to a nice looking date
                let dateConversionObject = new Date(lastRefresh);
                let month = dateConversionObject.toLocaleString('default', { month: 'long' });
                let day = dateConversionObject.getUTCDate();
                let year = dateConversionObject.getUTCFullYear();
                let UTCHour = dateConversionObject.getHours();
                let suffix = (UTCHour >= 12) ? " PM" : " AM";
                let hour = (( dateConversionObject.getHours() + 11) % 12 + 1);
                let minute = dateConversionObject.getMinutes();
                //Add zero to minutes if minutes equals 0
                let addZero = (minute === 0) ? "0" : "";
                let fullDate = month + " " + day + ", " + year + " " + hour + ":" + minute + addZero + suffix;
    
                document.querySelector('.tickerText').innerHTML = "Ticker: " + `<span class="red bold">${tickerName}</span>`;

                fetch(urlName).then(function(name) {
                    name.json().then(function(nameData) {
                        let stockName = nameData.bestMatches[0]['2. name'];
                        document.querySelector('.stockName').innerHTML = "Name: " + `<span class="red bold">${stockName}</span>`;
                    });
                });

                document.querySelector('.priceContainer').classList.add('addPadding');
    
                document.querySelector('.lastAvailPrice').innerHTML = "Last available price: " + 
                `<span class="green">${fullDate}</span`;
    
                document.querySelector('.openPrice').innerHTML = "Open price: " + 
                `<span class='green'> $${openPrice} </span>`;

                document.querySelector('.lowPrice').innerHTML = "Low price: " + 
                `<span class='green'> $${lowPrice} </span>`;

                document.querySelector('.highPrice').innerHTML = "High price: " + 
                `<span class='green'> $${highPrice} </span>`;

                document.querySelector('.closePrice').innerHTML = "Last price: " + 
                `<span class='green'> $${closePrice} </span>`;
    
                    if( Number( volume ) > 1 ) {
                        document.querySelector('.volume').innerHTML = "Daily volume: " + 
                        `<span class='green'> ${ numberWithCommas( volume ) } </span>`;
                    } else {
                        document.querySelector('.volume').innerHTML = "";
                    }

            } else {
                document.querySelector('.priceContainer').classList.remove('addPadding');

                let clearClasses = document.querySelectorAll('.clear');
                for (let i = 0; i < clearClasses.length; i++) {
                    let element = clearClasses[i];
                    element.innerHTML = "";
                }

                document.querySelector('.tickerDoesNotExist').innerHTML = "Ticker does not exist or failed to fetch data.";
            }
        });
    });
    
    //adds commas every 3 digits
    function numberWithCommas( x ) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

}

//Runs stockTicker function when a user presses the enter key
document.addEventListener("keydown", function(e) {
    if (e.key === 'Enter'){
        stockTicker();
    }
});
