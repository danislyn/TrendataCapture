// 目标目录
// var ROOT = '/mnt/mongo/ImageData/seller';
var ROOT = 'temp/seller';

var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

// ======================================
var chartUrlPrefix = 'http://trendata.cn/rest/getChart/';
var chartUrls = [
    '/seller/getReviewChange/'
];
var chartTypes = [
    'slopeLine'
];
var chartNames = [
    'reviewChangeChart'
];

var FIELDS = ['bag', 'dog', 'dress', 'office', 'skirt', 'wig'];

// key: field - value: array of seller
var sellerNames = {};
for(var i=0, len=FIELDS.length; i<len; i++){
    sellerNames[FIELDS[i]] = [];
}

// ======================================
var casper = require('casper').create();
casper.start();

// 获取各field下的seller名称
casper.then(function(){
    this.each(FIELDS, function(self, field){
        var link = 'http://112.124.1.3:8020/mobilefield/seller/' + field;
        self.thenOpen(link, function(){
            var sellers = self.evaluate(function(){
                var temp = document.getElementsByTagName('pre')[0].innerHTML;
                var json = eval('(' + temp + ')');
                var result = [];

                for(var i=0, len=json.data.length; i<len; i++){
                    result.push(json.data[i].name);
                }
                return result;
            });
            sellerNames[field] = sellers;
        });
    });
});

// 依次爬取图表
casper.then(function(){
    for(var field in sellerNames){
        var sellers = sellerNames[field];
        for(var i=0; i<sellers.length; i++){
            var seller = sellers[i];
            for(var j=0; j<chartUrls.length; j++){

                (function(self, field, name, cIndex){
                    var link = chartUrlPrefix + '?url=' + chartUrls[cIndex] + 
                        '&param={field:' + field + ',name:' + name + '}&type=' + chartTypes[cIndex];

                    self.thenOpen(link, function(){
                        self.waitFor(function check(){
                            return self.evaluate(function(){
                                return document.querySelectorAll('.blockUI').length == 0;
                            });
                        }, function then(){
                            console.log('fuck ' + field + ' ' + name + ' ' + chartNames[cIndex]);
                            self.captureSelector(ROOT + '/' + field + '/' + name + '/' + 
                                chartNames[cIndex] + '-' + TIME + '.png', '#chart');
                        });
                    });
                })(this, field, seller, j);
            }
        }
    }
});

casper.run();