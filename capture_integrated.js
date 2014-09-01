// 目标目录
// var ROOT = '/mnt/mongo/ImageData/mobilefield';
var ROOT = 'temp';
var PRODUCT_DIR = function(field){
    return ROOT + '/' + field + '/product/';
};
var SELLER_DIR = function(field){
    return ROOT + '/' + field + '/seller/';
};
var BRAND_DIR = function(field){
    return ROOT + '/' + field + '/brand/';
};
var SUMMARY_DIR = function(field){
    return ROOT + '/' + field + '/summary/';
};

// 当前分类
// var FIELDS = ['bag', 'dog', 'dress', 'office', 'skirt', 'wig'];
var FIELDS = ['bag'];

// 当前日期
var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

// ======================================
// 截图项配置
// ======================================
var chartUrlPrefix = 'http://trendata.cn/rest/getChart/';

// product part
var productChartUrls = [
    '/product/getPriceCurlChart/',
    '/product/getReviewChange/',
    '/product/getReviewIncrement/',
    '/product/getEmotionWords/'
];
var productChartTypes = [
    'line',
    'slopeLine',
    'column',
    'barStack'
];
var productChartNames = [
    'priceChangeChart',
    'reviewChangeChart',
    'reviewIncrementChart',
    'emotionWordsChart'
];

var productUrlPrefix = 'http://trendata.cn/mp/productDetail/';
var productShotTargets = [
    '#starsBlock',
    '#infoBlock',
    'body'
];
var productShotNames = [
    'starsInfoShot',
    'productInfoShot',
    'fullScreen'
];

// seller part
var sellerChartUrls = [
    '/seller/getReviewChange/'
];
var sellerChartTypes = [
    'slopeLine'
];
var sellerChartNames = [
    'reviewChangeChart'
];

var sellerUrlPrefix = 'http://trendata.cn/mp/sellerDetail/';
var sellerShotTargets = [
    '#starsBlock',
    '#infoBlock',
    '#reviewCompete',
    'body'
];
var sellerShotNames = [
    'starsInfoShot',
    'sellerInfoShot',
    'reviewCompeteInfoShot',
    'fullScreen'
];

// brand part
var brandChartUrls = [
    // TODO
];
var brandChartTypes = [
    // TODO
];
var brandChartNames = [
    // TODO
];

var brandUrlPrefix = 'http://trendata.cn/mp/brandDetail/';
var brandShotTargets = [
    'body'
];
var brandShotNames = [
    'fullScreen'
];

// summary part
var fieldChartUrls = [
    '/field/getPriceDistributionChart/',
    '/field/getScoreDistributionChart/'
];
var fieldChartTypes = [
    'column',
    'pie'
];
var fieldChartNames = [
    'priceDistributionChart',
    'scoreDistributionChart'
];

var fieldUrlPrefix = 'http://trendata.cn/mp/productSummary/';
var fieldShotTargets = [
    'body'
];
var fieldShotNames = [
    'fullScreen'
];

// ======================================
// 中间数据初始化
// ======================================
// key: field - value: array of product ASIN
var productsMap = {};
// key: field - value: array of seller name
var sellersMap = {};
// key: field - value: array of brand name
var brandsMap = {};

// map初始化
for(var i=0, len=FIELDS.length; i<len; i++){
    productsMap[FIELDS[i]] = [];
    sellersMap[FIELDS[i]] = [];
    brandsMap[FIELDS[i]] = [];
}

// ======================================
// 浏览器初始化
// ======================================
var casper = require('casper').create({
    viewportSize: {
        width: 440,
        height: 800
    }
});
casper.start();

// ======================================
// 爬取中间数据
// ======================================
var API_PRODUCT_PREFIX = 'http://112.124.1.3:8020/mobilefield/';
var API_SELLER_PREFIX = 'http://112.124.1.3:8020/mobilefield/seller/';
var API_BRAND_PREFIX = 'http://112.124.1.3:8020/mobilefield/brand/';

var integratedData = [
    // for product
    {
        'API_PREFIX': API_PRODUCT_PREFIX,
        'jsonKey': 'ASIN',
        'dataMap': productsMap
    },
    // for seller
    {
        'API_PREFIX': API_SELLER_PREFIX,
        'jsonKey': 'name',
        'dataMap': sellersMap
    },
    // for brand
    {
        'API_PREFIX': API_BRAND_PREFIX,
        'jsonKey': 'name',
        'dataMap': brandsMap
    }
];
/*
casper.then(function(){
    for(var i=0; i<FIELDS.length; i++){
        var field = FIELDS[i];
        for(var j=0; j<integratedData.length; j++){
            var group = integratedData[j];

            (function(self, field, group){
                var link = group['API_PREFIX'] + field;
                console.log(link);

                self.thenOpen(link, function(){
                    console.log('key: ' + group['jsonKey']);
                    var data = self.evaluate(function(){
                        var temp = document.getElementsByTagName('pre')[0].innerHTML;
                        var json = eval('(' + temp + ')');
                        var result = [];

                        for(var t=0, len=json.data.length; t<len; t++){
                            result.push(json.data[t][group['jsonKey']]);
                        }
                        return result;
                    });
                    console.log('data: ' + data);
                    group['dataMap'][field] = data;
                });
            })(this, field, group);
        }
    }
});*/


// 获取各field下的product ASIN
casper.then(function(){
    this.each(FIELDS, function(self, field){
        var link = API_PRODUCT_PREFIX + field;
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
            productsMap[field] = asins;
        });
    });
});

// 获取各field下的seller名称
casper.then(function(){
    this.each(FIELDS, function(self, field){
        var link = API_SELLER_PREFIX + field;
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
            sellersMap[field] = sellers;
        });
    });
});

// 获取各field下的brand名称
casper.then(function(){
    this.each(FIELDS, function(self, field){
        var link = API_BRAND_PREFIX + field;
        self.thenOpen(link, function(){
            var brands = self.evaluate(function(){
                var temp = document.getElementsByTagName('pre')[0].innerHTML;
                var json = eval('(' + temp + ')');
                var result = [];

                for(var i=0, len=json.data.length; i<len; i++){
                    result.push(json.data[i].name);
                }
                return result;
            });
            brandsMap[field] = brands;
        });
    });
});

casper.then(function(){
    console.log(productsMap[FIELDS[0]].length);
    console.log(sellersMap[FIELDS[0]].length);
    console.log(brandsMap[FIELDS[0]].length);
    console.log(integratedData[2]['dataMap'][FIELDS[0]][0]);
});

// ======================================
// 依次爬取图表
// ======================================

/*casper.then(function(){

});*/


// product
casper.then(function(){
    for(var field in productsMap){
        var asins = productsMap[field];
        for(var i=0; i<asins.length; i++){
            var asin = asins[i];

            // chart
            for(var j=0; j<productChartUrls.length; j++){

                (function(self, field, asin, cIndex){
                    var link = chartUrlPrefix + '?url=' + productChartUrls[cIndex] + 
                        '&param={"asin":"' + asin + '"}&type=' + productChartTypes[cIndex];

                    self.thenOpen(link, function(){
                        self.waitFor(function check(){
                            return self.evaluate(function(){
                                return document.querySelectorAll('.blockUI').length == 0;
                            });
                        }, function then(){
                            console.log('fuck ' + field + ' ' + asin + ' ' + productChartNames[cIndex]);
                            self.captureSelector(PRODUCT_DIR(field) + asin + '/' + 
                                productChartNames[cIndex] + '-' + TIME + '.png', '#chart');
                        });
                    });
                })(this, field, asin, j);
            }

            // detail
            for(var j=0; j<productShotTargets.length; j++){

                (function(self, field, asin, cIndex){
                    var link = productUrlPrefix + '?field=' + field + '&asin=' + asin;
                    self.thenOpen(link, function(){
                        console.log('fuck ' + field + ' ' + asin + ' ' + productShotNames[cIndex]);
                        self.captureSelector(PRODUCT_DIR(field) + asin + '/' + 
                            productShotNames[cIndex] + '-' + TIME + '.png', productShotTargets[cIndex]);
                    });
                })(this, field, asin, j);
            }
        }
    }
});

// seller
casper.then(function(){
    for(var field in sellersMap){
        var sellers = sellersMap[field];
        for(var i=0; i<sellers.length; i++){
            var seller = sellers[i];

            // chart
            for(var j=0; j<sellerChartUrls.length; j++){

                (function(self, field, name, cIndex){
                    var link = chartUrlPrefix + '?url=' + sellerChartUrls[cIndex] + 
                        '&param={"field":"' + field + '","name":"' + name + '"}&type=' + sellerChartTypes[cIndex];

                    self.thenOpen(link, function(){
                        self.waitFor(function check(){
                            return self.evaluate(function(){
                                return document.querySelectorAll('.blockUI').length == 0;
                            });
                        }, function then(){
                            console.log('fuck ' + field + ' ' + name + ' ' + sellerChartNames[cIndex]);
                            self.captureSelector(SELLER_DIR(field) + name + '/' + 
                                sellerChartNames[cIndex] + '-' + TIME + '.png', '#chart');
                        });
                    });
                })(this, field, seller, j);
            }

            // detail
            for(var j=0; j<sellerShotTargets.length; j++){

                (function(self, field, name, cIndex){
                    var link = sellerUrlPrefix + '?field=' + field + '&name=' + name;
                    self.thenOpen(link, function(){
                        console.log('fuck ' + field + ' ' + name + ' ' + sellerShotNames[cIndex]);
                        self.captureSelector(SELLER_DIR(field) + name + '/' + 
                            sellerShotNames[cIndex] + '-' + TIME + '.png', sellerShotTargets[cIndex]);
                    });
                })(this, field, seller, j);
            }
        }
    }
});

// brand
casper.then(function(){
    for(var field in brandsMap){
        var brands = brandsMap[field];
        for(var i=0; i<brands.length; i++){
            var brand = brands[i];

            // chart
            for(var j=0; j<brandChartUrls.length; j++){

                (function(self, field, name, cIndex){
                    var link = chartUrlPrefix + '?url=' + brandChartUrls[cIndex] + 
                        '&param={"field":"' + field + '","name":"' + name + '"}&type=' + brandChartTypes[cIndex];

                    self.thenOpen(link, function(){
                        self.waitFor(function check(){
                            return self.evaluate(function(){
                                return document.querySelectorAll('.blockUI').length == 0;
                            });
                        }, function then(){
                            console.log('fuck ' + field + ' ' + name + ' ' + brandChartNames[cIndex]);
                            self.captureSelector(BRAND_DIR(field) + name + '/' + 
                                brandChartNames[cIndex] + '-' + TIME + '.png', '#chart');
                        });
                    });
                })(this, field, brand, j);
            }

            // detail
            for(var j=0; j<brandShotTargets.length; j++){

                (function(self, field, name, cIndex){
                    var link = brandUrlPrefix + '?field=' + field + '&name=' + name;
                    self.thenOpen(link, function(){
                        console.log('fuck ' + field + ' ' + name + ' ' + brandShotNames[cIndex]);
                        self.captureSelector(BRAND_DIR(field) + name + '/' + 
                            brandShotNames[cIndex] + '-' + TIME + '.png', brandShotTargets[cIndex]);
                    });
                })(this, field, brand, j);
            }
        }
    }
});

// summary
casper.then(function(){
    for(var i=0; i<FIELDS.length; i++){
        var field = FIELDS[i];

        // chart
        for(var j=0; j<fieldChartUrls.length; j++){

            (function(self, field, cIndex){
                var link = chartUrlPrefix + '?url=' + fieldChartUrls[cIndex] + 
                    '&param={"field":"' + field + '"}&type=' + fieldChartTypes[cIndex];

                self.thenOpen(link, function(){
                    self.waitFor(function check(){
                        return self.evaluate(function(){
                            return document.querySelectorAll('.blockUI').length == 0;
                        });
                    }, function then(){
                        console.log('fuck ' + field + ' ' + fieldChartNames[cIndex]);
                        self.captureSelector(SUMMARY_DIR(field) + 
                            fieldChartNames[cIndex] + '-' + TIME + '.png', '#chart');
                    });
                });
            })(this, field, j);
        }

        // detail
        for(var j=0; j<fieldShotTargets.length; j++){

            (function(self, field, cIndex){
                var link = fieldUrlPrefix + '?field=' + field;
                self.thenOpen(link, function(){
                    console.log('fuck ' + field + ' ' + fieldShotNames[cIndex]);
                    self.captureSelector(SUMMARY_DIR(field) + 
                        fieldShotNames[cIndex] + '-' + TIME + '.png', fieldShotTargets[cIndex]);
                });
            })(this, field, j);
        }
    }
});

// ======================================
casper.run();