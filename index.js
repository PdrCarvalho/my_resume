function xhttpAssincrono(callBackFunction) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callBackFunction(this.responseText);
        }
    };
    var url = "https://api.github.com/users/PdrCarvalho/repos?page=1&per_page=10&direction=desc&sort=created";
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
function treat_response(response) {
    if (response) {
        var obj = JSON.parse(response)
        var jsonLanguage = {}
        obj.map(item => {
            if (item.language in jsonLanguage){
                jsonLanguage[item.language] = jsonLanguage[item.language] + 1
            }
            else{
                jsonLanguage[item.language] = 1
            }
            console.log(jsonLanguage[item.language])
        })
        rows = Object.entries(jsonLanguage)
        localStorage.setItem('language_github', JSON.stringify(jsonLanguage))
        create_graph(rows)
    }
}

function create_graph(rows) {
    
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    name_chart = 'Language by GitHub'
    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Language');
        data.addColumn('number', 'Quantity');
        data.addRows(rows);
        var options = {
            'title': name_chart,
            'width': 400,
            'height': 300
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
}


    function load_graph() {
        var localData = JSON.parse(localStorage.getItem('language_github'))

        if (localData) {
            create_graph(Object.entries(localData))
        }
        else {
            
            xhttpAssincrono(treat_response);
        }

    }