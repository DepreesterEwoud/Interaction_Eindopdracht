// ----------------------------------- VARS, LETS  ----------------------------------- //
let domSelect, domPercentage, domDiffrence, domVolume, domUpdated, domLow, domHigh, domButtons, amount, domLogo = "";

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const head = {
    "authorization": "Apikey 919252046791580f51b013cdbc726e4cef0aedc6de9585221c0e721df92fe1de"
}

let selectedValue = "BTC";

let dayscount = 7;

let symbol = "";

let valueYesterday, valueNow, percentage, volume = 0;



// ----------------------------------- BASICS  ----------------------------------- //

const getDOM = function () {
    domSelect = document.querySelector('.js-select');
    domPercentage = document.querySelector('.js-percentage');
    domVolume = document.querySelector('.js-volume');
    domUpdated = document.querySelector('.js-updated');
    domLow = document.querySelector('.js-low');
    domHigh = document.querySelector('.js-high');
    domButtons = document.querySelectorAll(".js-button");
    domLogo = document.querySelector('.js-logo');
    domDiffrence = document.querySelector('.js-diffrence');
}

const enableListeners = function () {
    domSelect.addEventListener('change', function () {
        document.getElementById('c-app-style').classList.remove('c-app');
        document.getElementById('c-app-style').classList.add('c-app-none');
        document.getElementById('c-opstart-load').classList.add('loading');
        document.getElementById('c-opstart-load-bollen').classList.add('loader');
        setTimeout(()=>{
            document.getElementById('c-opstart-load').classList.remove('loading');
            document.getElementById('c-opstart-load-bollen').classList.remove('loader');
            document.getElementById('c-app-style').classList.remove('c-app-none');
            document.getElementById('c-app-style').classList.add('c-app');
            
        },2000)
        
        selectedValue = this.value; 
        showData(selectedValue);
        
        if(selectedValue == "XRP")
        {
            domLogo.src = "https://static.cryptotips.eu/wp-content/uploads/2018/01/ripple-xrp-logo.png";
            document.body.style.backgroundColor = 'rgba(14, 155, 210, .3)';
            

        }

        if(selectedValue == "BTC")
        {
            domLogo.src = "https://btcdirect.eu/media/1108/download/Bitcoin.png?v=1";
            document.body.style.backgroundColor = 'rgba(255, 179, 71, .6)';
            
        }

        if(selectedValue == "ETC")
        {
            domLogo.src = "https://static.cryptotips.eu/wp-content/uploads/2018/05/ethereum-classic-etc-logo-230x230.png";
            document.body.style.backgroundColor = 'rgba(57, 183, 57, .3)';
        }

        if(selectedValue == "ETH")
        {
            domLogo.src = "https://etherscan.io/images/ethereum-icon.png";
            document.body.style.backgroundColor = 'rgba(168, 185, 198, .3)';
        }
        
        if(selectedValue == "BAT")
        {
            domLogo.src = "https://cdn.worldvectorlogo.com/logos/basic-attention-token.svg";
            document.body.style.backgroundColor = 'rgba(255, 80, 0, .3)';
        }

    })



    for (let button of domButtons) {
        button.classList.remove('is-selected');
        button.addEventListener('click', function () {

            buttons = document.getElementsByClassName('c-link-cta');
            for(let clink of buttons)
            {
                clink.classList.remove('is-selected');
            }


            dayscount = button.getAttribute('data-value');
            loadDataChart(selectedValue, dayscount, symbol);
            button.childNodes[1].classList.add('is-selected');
        })
    }

}

const init = function () {
    document.getElementById('c-app-style').classList.add('c-app-none');
    document.getElementById('c-opstart-load').classList.add('loading');
    document.getElementById('c-opstart-load-bollen').classList.add('loader');
    setTimeout(()=>{
        document.getElementById('c-opstart-load').classList.remove('loading');
        document.getElementById('c-opstart-load-bollen').classList.remove('loader');
        document.getElementById('c-app-style').classList.remove('c-app-none');
        document.getElementById('c-app-style').classList.add('c-app');
        
    },2000)
    getDOM();
    enableListeners();
    showData("BTC");
    domLogo.src = "https://btcdirect.eu/media/1108/download/Bitcoin.png?v=1";
    document.body.style.backgroundColor = 'rgba(255, 179, 71, .6)';
}


// ----------------------------------- SHOWING DATA  ----------------------------------- //


const showData = function (cryptocurrency) {
    
    loadPrices(cryptocurrency);
    loadDiffrence(cryptocurrency);
    loadDataUpdated(cryptocurrency);
    loadPricesHighLow(cryptocurrency);
}

const showPrices = function () {
    symbol = "";
    percentage = (1 - (valueYesterday / valueNow)) * 100;

    domHolder = document.querySelector(`.js-price`)
    domHolder.innerHTML = "€" + valueNow;
    //countUp(valueYesterday, valueNow, "js-price");

    if (percentage < 0) {
        symbol = "-";
        domPercentage.setAttribute("style", "color: var(--global-color-rood)")
    } else {
        symbol = "+";
        domPercentage.setAttribute("style", "color: var(--global-color-green)")
    }


    domPercentage.innerHTML = symbol + " " + Math.abs(percentage.toFixed(2)) + " %";

    loadDataChart(selectedValue, dayscount, symbol);
}


const showLastUpdated = function (data, cryptocurrency) {
    let unixTime = data.RAW[cryptocurrency].EUR.LASTUPDATE

    dateObj = new Date(unixTime * 1000);


    dayNumber = dateObj.getDate();
    nameDay = days[dateObj.getDay()];
    nameMonth = months[dateObj.getMonth()];
    houre = dateObj.getHours();
    minutes = dateObj.getMinutes();
    seconds = dateObj.getSeconds();

    let stringUpdated = dayNumber + " " + nameMonth + " " + houre + ":"+ minutes+":"+seconds;

    domUpdated.innerHTML = stringUpdated;
}

const showRangeDaily = function (min, max) {
    domHigh.innerHTML = max.replace(",", " ")
    domLow.innerHTML = min.replace("," , " ")
}

const showDiffrence = function (min,max) {
    symbol = "";
    amount = max - min;
    console.log(amount);


    if (amount < 0) {
        symbol = "-";
        domDiffrence.setAttribute("style", "color: var(--global-color-rood)")
    } else {
        symbol = "+";
        domDiffrence.setAttribute("style", "color: var(--global-color-green)")
    }


    domDiffrence.innerHTML = symbol + " €" + Math.abs(amount.toFixed(2));


}



// ----------------------------------- LOADING DATA  ----------------------------------- //


const loadPrices = function (cryptocurrency) {
    const urlAPI = `https://min-api.cryptocompare.com/data/price?fsym=${cryptocurrency}&tsyms=EUR`;

    fetch(urlAPI, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        valueNow = data.EUR;
        loadHighLowPrices(cryptocurrency);
    });

}

const loadHighLowPrices = function (cryptocurrency) {
    const urlAPI = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=EUR&limit=10`;

    fetch(urlAPI, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        valueYesterday = data.Data.Data[9].open;
        showPrices();
    });
}

const loadDiffrence = function (cryptocurrency) {
    const urlAPI = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

    fetch(urlAPI, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        showDiffrence(data.RAW[cryptocurrency].EUR.LOW24HOUR, data.RAW[cryptocurrency].EUR.HIGH24HOUR)
    });
}

const loadDataUpdated = function (cryptocurrency) {
    const urlAPI = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

    fetch(urlAPI, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        showLastUpdated(data, cryptocurrency);
    });
}

const loadPricesHighLow = async function (cryptocurrency) {
    const urlAPI = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;
    
    fetch(urlAPI, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        
        showRangeDaily(data.DISPLAY[cryptocurrency].EUR.LOW24HOUR, data.DISPLAY[cryptocurrency].EUR.HIGH24HOUR);
    });
}



document.addEventListener('DOMContentLoaded', init)