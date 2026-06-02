/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9116997792494481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.868421052631579, 500, 1500, "HTTP Request-3"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "HTTP Request-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "HTTP Request-5"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-1"], "isController": false}, {"data": [0.9629629629629629, 500, 1500, "HTTP Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-12"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "HTTP Request-11"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-10"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-7"], "isController": false}, {"data": [0.8902439024390244, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.9375, 500, 1500, "HTTP Request-6"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "HTTP Request-9"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "HTTP Request-8"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 453, 0, 0.0, 470.3841059602651, 67, 4079, 316.0, 535.0000000000001, 1242.1999999999944, 3666.8199999999965, 26.466464127132507, 1328.3367901378826, 6.932646628154943], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-3", 19, 0, 0.0, 434.63157894736844, 254, 563, 465.0, 558.0, 563.0, 563.0, 2.2839283567736506, 11.809844181993027, 0.2654174555235004], "isController": false}, {"data": ["HTTP Request-2", 27, 0, 0.0, 382.7037037037037, 272, 551, 344.0, 541.8, 548.6, 551.0, 3.301137058320088, 82.38550613614133, 1.0606192306516689], "isController": false}, {"data": ["HTTP Request-5", 18, 0, 0.0, 449.7777777777777, 278, 682, 475.5, 657.7, 682.0, 682.0, 2.1916473882868623, 21.517787159077074, 0.7041523347132596], "isController": false}, {"data": ["HTTP Request-4", 18, 0, 0.0, 198.9444444444444, 67, 310, 295.0, 308.2, 310.0, 310.0, 2.194854286062675, 2.18413722411901, 0.55383394555542], "isController": false}, {"data": ["HTTP Request-1", 27, 0, 0.0, 193.0, 67, 372, 295.0, 306.2, 345.9999999999999, 372.0, 3.3928122643880374, 3.37624579825333, 0.8608426661849711], "isController": false}, {"data": ["HTTP Request-0", 27, 0, 0.0, 371.2962962962963, 251, 541, 380.0, 490.4, 531.0, 541.0, 3.412106659926703, 3.5954975199039554, 0.3965241138000758], "isController": false}, {"data": ["HTTP Request-12", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 262.0837909345048, 0.3712809504792332], "isController": false}, {"data": ["HTTP Request-11", 7, 0, 0.0, 351.28571428571433, 308, 529, 312.0, 529.0, 529.0, 529.0, 6.560449859418931, 463.2686196696345, 2.1078007849109652], "isController": false}, {"data": ["HTTP Request-10", 7, 0, 0.0, 143.2857142857143, 68, 296, 74.0, 296.0, 296.0, 296.0, 8.474576271186441, 8.433196504237289, 2.135195974576271], "isController": false}, {"data": ["HTTP Request-7", 14, 0, 0.0, 184.99999999999997, 67, 305, 177.0, 304.5, 305.0, 305.0, 1.8607123870281765, 1.8516268773258904, 0.46881230063795853], "isController": false}, {"data": ["HTTP Request", 246, 0, 0.0, 591.4878048780486, 305, 4079, 316.0, 1115.6000000000008, 3225.999999999996, 3848.53, 14.37251694321103, 1188.9885788516592, 4.209785434681001], "isController": false}, {"data": ["HTTP Request-6", 16, 0, 0.0, 383.87500000000006, 277, 567, 360.5, 542.5, 567.0, 567.0, 2.12286055459732, 23.350040840188406, 0.24669961523152448], "isController": false}, {"data": ["HTTP Request-9", 12, 0, 0.0, 370.9166666666667, 269, 528, 349.0, 527.7, 528.0, 528.0, 1.694915254237288, 58.76547603283898, 0.1969676906779661], "isController": false}, {"data": ["HTTP Request-8", 14, 0, 0.0, 365.4285714285714, 275, 507, 333.5, 498.5, 507.0, 507.0, 1.8024977468778165, 22.372044788850264, 0.5791228112527359], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 453, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
