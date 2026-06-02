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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9046242774566474, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.875, 500, 1500, "HTTP Request-3"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP Request-2"], "isController": false}, {"data": [0.9, 500, 1500, "HTTP Request-5"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-1"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "HTTP Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-11"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-10"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-7"], "isController": false}, {"data": [0.9, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.95, 500, 1500, "HTTP Request-6"], "isController": false}, {"data": [0.8, 500, 1500, "HTTP Request-9"], "isController": false}, {"data": [0.9375, 500, 1500, "HTTP Request-8"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 346, 0, 0.0, 470.05780346820825, 68, 3620, 320.0, 536.2, 1097.749999999999, 3441.9999999999973, 23.119069891754645, 1419.4486017264132, 4.789697794166778], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-3", 12, 0, 0.0, 462.0833333333333, 313, 773, 475.5, 700.4000000000003, 773.0, 773.0, 6.472491909385114, 93.02626921521035, 0.752174352750809], "isController": false}, {"data": ["HTTP Request-2", 12, 0, 0.0, 409.0833333333333, 278, 549, 408.5, 542.4, 549.0, 549.0, 7.259528130671506, 5.550986842105263, 2.3324069872958257], "isController": false}, {"data": ["HTTP Request-5", 10, 0, 0.0, 398.1, 278, 566, 399.0, 560.8000000000001, 566.0, 566.0, 5.865102639296188, 4.484741568914956, 1.8843933284457477], "isController": false}, {"data": ["HTTP Request-4", 10, 0, 0.0, 139.6, 69, 303, 73.0, 302.4, 303.0, 303.0, 7.849293563579277, 7.810966934850863, 1.9776540423861853], "isController": false}, {"data": ["HTTP Request-1", 12, 0, 0.0, 128.66666666666669, 68, 306, 72.0, 304.2, 306.0, 306.0, 8.540925266903916, 8.49922153024911, 2.1519128113879002], "isController": false}, {"data": ["HTTP Request-0", 12, 0, 0.0, 426.08333333333337, 282, 539, 436.0, 532.1, 539.0, 539.0, 6.493506493506494, 5.586698457792208, 0.7546164772727272], "isController": false}, {"data": ["HTTP Request-11", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 224.24216621253407, 0.8754470367847411], "isController": false}, {"data": ["HTTP Request-10", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 13.63174229452055, 3.4514126712328768], "isController": false}, {"data": ["HTTP Request-7", 8, 0, 0.0, 212.0, 70, 304, 287.0, 304.0, 304.0, 304.0, 8.2389289392379, 8.198699794026776, 2.075823892893924], "isController": false}, {"data": ["HTTP Request", 245, 0, 0.0, 526.2734693877552, 305, 3620, 319.0, 588.6000000000001, 2235.3999999999996, 3546.7799999999993, 16.37043966323667, 1348.402081175665, 3.299470988407056], "isController": false}, {"data": ["HTTP Request-6", 10, 0, 0.0, 396.40000000000003, 272, 511, 408.0, 509.2, 511.0, 511.0, 6.226650062266501, 106.30423995952677, 0.7236048412204233], "isController": false}, {"data": ["HTTP Request-9", 5, 0, 0.0, 425.2, 314, 509, 479.0, 509.0, 509.0, 509.0, 5.070993914807302, 333.94772914553755, 0.5893049568965517], "isController": false}, {"data": ["HTTP Request-8", 8, 0, 0.0, 373.62499999999994, 291, 535, 345.5, 535.0, 535.0, 535.0, 6.6170388751033915, 207.21460788875103, 2.125982216708023], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 346, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
