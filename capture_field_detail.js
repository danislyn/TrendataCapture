// 目标目录
// var ROOT = '/mnt/mongo/ImageData/mobilefield';
var ROOT = 'temp';

var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

// ======================================
var pageUrlPrefix = 'http://trendata.cn/mp/productSummary/';
var chartTargets = [
    'body'
];
var chartNames = [
    'fullScreen'
];

var FIELDS = ['bag', 'dog', 'dress', 'office', 'skirt', 'wig'];

// ======================================
var casper = require('casper').create();
casper.start();

// 依次爬取图表
casper.then(function(){
    for(var i=0; i<FIELDS.length; i++){
        var field = FIELDS[i];
        for(var j=0; j<chartTargets.length; j++){

            (function(self, field, cIndex){
                var link = pageUrlPrefix + '?field=' + field;
                self.thenOpen(link, function(){
                    console.log('fuck ' + field + ' ' + chartNames[cIndex]);
                    self.captureSelector(ROOT + '/' + field + '/summary/' + 
                        chartNames[cIndex] + '-' + TIME + '.png', chartTargets[cIndex]);
                });
            })(this, field, j);
        }
    }
});

casper.run();