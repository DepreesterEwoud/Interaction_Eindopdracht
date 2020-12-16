let color;
let html_graph = '.js-graph';
let ctx;
var myChart;
const loadDataChart = async function (cryptocurrency, days, token) {

    let ArrayXValues = [];
    let ArrayYValues = [];

    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=EUR&limit=${days}`;
    const response = await fetch(urlHighMaxDaily, {
        headers: head
        
    });
    
    const data = await response.json();

    for (let dataItem of data.Data.Data) {
        let unixTime = dataItem.time
        let high = dataItem.high

        dateObj = new Date(unixTime * 1000);

        dayNumber = dateObj.getDate();
        nameDay = days[dateObj.getDay()];
        nameMonth = months[dateObj.getMonth()];
        numberMonth = dateObj.getMonth()+1;
        //console.log(dateObj.getMonth()+1);

        let stringTime = dayNumber + "/" + numberMonth;

        ArrayXValues.push(stringTime);
        ArrayYValues.push(high);
    }

    showChart(ArrayXValues, ArrayYValues, token);
}



const showChart = function (xValues, yValues, token) {

    
    
    var json = `{"jsonarray": [`;
    let i = 0;

    for (let value of xValues) {
        json += `{"Date": "${xValues[i]}",
                  "Value": "${yValues[i]}"},`
        i++;
    }

    var cuttedjson = json.substring(0, json.length - 1);

    cuttedjson += "]}"

    var jsonData = JSON.parse(cuttedjson);

    var labels = jsonData.jsonarray.map(function (e) {
        return e.Date;
    });
    var data = jsonData.jsonarray.map(function (e) {
        
        return e.Value;
    });
    
    let pointOnly = [];
    for (const point of data) {
        pointOnly.push(null);
    }

    pointOnly.shift();
    pointOnly.push(data[data.length - 1])

    let red = "rgba(186, 70, 63, 0.8)";
    let green = "rgba(74, 179, 97, 0.8)";

    if (token == "-") {
        color = red;


    } else {
        color = green;
    }

    console.log(labels);
    
    if(document.querySelector(".js-graph")){
        //html_graph.innerHTML = `<canvas id="myChart" style="width:10px;height:100%;></canvas>`;
        
        ctx = document.querySelector('#myChart').getContext('2d');
        var gradientFill = ctx.createLinearGradient(0, 0, 0, 800);
        gradientFill.addColorStop(0, color);
        gradientFill.addColorStop(1, "transparent");

        let config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: gradientFill,
                    pointRadius: 0
                },],
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
            

                scales: {
                    xAxes: [{
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                        },
                        /* scaleLabel: {
                            display: true,
                            labelString: 'Date',
            
                          }, */
                        ticks: {
                            fontColor: "black"
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                        },

                        ticks: {
                            fontColor: "black"

                        },
                    },],
                },
            },
        };
        
        myChart = new Chart(ctx, config);
        //myChart.update();
        
    };
    /* new Chart(ctx, {
        //animationEnabled: true,
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: gradientFill,
                pointRadius: 0
            },{
                data: pointOnly,
                borderWidth: 8,
                pointHitRadius: 5,

            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
           

            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    ticks: {
                        fontColor: "black"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    ticks: {
                        fontColor: "black"

                    }
                }]
            },
        }
    }); */


}