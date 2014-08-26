// 目标目录
// var ROOT = '/mnt/mongo/ImageData/mobilefield';
var ROOT = 'temp';

var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

// ======================================
var chartUrlPrefix = 'http://trendata.cn/rest/getChart/';
var chartUrls = [
    '/field/getPriceDistributionChart/',
    '/field/getScoreDistributionChart/'
];
var chartTypes = [
    'column',
    'pie'
];
var chartNames = [
    'priceDistributionChart',
    'scoreDistributionChart'
];

var FIELDS = ['bag', 'dog', 'dress', 'office', 'skirt', 'wig'];

// ======================================
var casper = require('casper').create();
casper.start();

// 依次爬取图表
casper.then(function(){
    for(var i=0; i<FIELDS.length; i++){
        var field = FIELDS[i];
        for(var j=0; j<chartUrls.length; j++){

            (function(self, field, cIndex){
                var link = chartUrlPrefix + '?url=' + chartUrls[cIndex] + 
                    '&param={"field":"' + field + '"}&type=' + chartTypes[cIndex];

                self.thenOpen(link, function(){
                    self.waitFor(function check(){
                        return self.evaluate(function(){
                            return document.querySelectorAll('.blockUI').length == 0;
                        });
                    }, function then(){
                        console.log('fuck ' + field + ' ' + chartNames[cIndex]);
                        self.captureSelector(ROOT + '/' + field + '/summary/' + 
                            chartNames[cIndex] + '-' + TIME + '.png', '#chart');
                    });
                });
            })(this, field, j);
        }
    }
});

casper.run();