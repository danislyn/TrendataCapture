// 目标目录
// var ROOT = '/mnt/mongo/ImageData/mobilefield';
var ROOT = 'temp';

var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

// ======================================
var pageUrlPrefix = 'http://trendata.cn/mp/productDetail/';
var chartTargets = [
    '#starsBlock',
    '#infoBlock',
    'body'
];
var chartNames = [
    'starsInfoShot',
    'productInfoShot',
    'fullScreen'
];

var FIELDS = ['bag', 'dog', 'dress', 'office', 'skirt', 'wig'];

// key: field - value: array of product ASIN
var products = {};
for(var i=0, len=FIELDS.length; i<len; i++){
    products[FIELDS[i]] = [];
}

// ======================================
var casper = require('casper').create({
    viewportSize: {
        width: 440,
        height: 800
    }
});
casper.start();

// 获取各field下的product ASIN
casper.then(function(){
    this.each(FIELDS, function(self, field){
        var link = 'http://112.124.1.3:8020/mobilefield/' + field;
        self.thenOpen(link, function(){
            var asins = self.evaluate(function(){
                var temp = document.getElementsByTagName('pre')[0].innerHTML;
                var json = eval('(' + temp + ')');
                var result = [];

                for(var i=0, len=json.data.length; i<len; i++){
                    result.push(json.data[i].ASIN);
                }
                return result;
            });
            products[field] = asins;
        });
    });
});

// 依次爬取图表
casper.then(function(){
    for(var field in products){
        var asins = products[field];
        for(var i=0; i<asins.length; i++){
            var asin = asins[i];
            for(var j=0; j<chartTargets.length; j++){

                (function(self, field, asin, cIndex){
                    var link = pageUrlPrefix + '?field=' + field + '&asin=' + asin;
                    self.thenOpen(link, function(){
                        console.log('fuck ' + field + ' ' + asin + ' ' + chartNames[cIndex]);
                        self.captureSelector(ROOT + '/' + field + '/product/' + asin + '/' + 
                            chartNames[cIndex] + '-' + TIME + '.png', chartTargets[cIndex]);
                    });
                })(this, field, asin, j);
            }
        }
    }
});

casper.run();