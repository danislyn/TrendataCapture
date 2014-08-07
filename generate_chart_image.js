// 目标目录
var ROOT = '/mnt/mongo/ImageData';
// var ROOT = 'temp';

var now = new Date();
var TIME = now.getFullYear() + '' + 
    (now.getMonth() < 9 ? ('0'+(now.getMonth()+1)) : (now.getMonth()+1)) + '' + 
    (now.getDate() < 10 ? ('0'+now.getDate()) : now.getDate());

var categories = [];
var categoryUrls = [];
var categoryPaths = [];

var products = [];  // [[array of asin], [...]]
var pages = [];  // [[array of capture url], [...]]

var chartUrlPrefix = 'http://trendata.cn/rest/getChart/';
var chartUrls = [
    '/product/getPriceCurlChart/',
    '/product/getReviewChange/',
    '/product/getReviewIncrement/',
    '/product/getEmotionWords/'
];
var chartTypes = [
    'line',
    'slopeLine',
    'column',
    'barStack'
];
var chartNames = [
    'priceChangeChart',
    'reviewChangeChart',
    'reviewIncrementChart',
    'emotionWordsChart'
];
var CHART_NUM = 4;

// ======================================
var casper = require('casper').create();

// 爬取所有分类名称
casper.start('http://112.124.1.3:8020/category/all', function(){
    categories = this.evaluate(function(){
        var temp = document.getElementsByTagName('pre')[0].innerHTML;
        var json = eval('(' + temp + ')');
        var result = [];

        for(var i=0, len=json.data.length; i<len; i++){
            result.push(json.data[i].name);
        }
        return result;
    });
    console.log('category length = ' + categories.length);
});

// 生成分类url和目录path
casper.then(function(){
    for(var i=0, len=categories.length; i<len; i++){
        var name = categories[i];
        var url = 'http://112.124.1.3:8020/category/' + name.replace(/&gt;/g, '%3E').replace(/&amp;/g, '&').replace(/ /g, '%20');
        categoryUrls.push(url);

        var path = name.replace(/&amp;/g, '&').split('&gt;').join('/');
        categoryPaths.push(path);
        console.log(path);
    }
    console.log('url length = ' + categoryUrls.length);
    console.log('path length = ' + categoryPaths.length);
});

// 依次爬取分类下的前20个ASIN
casper.then(function(){
    this.each(categoryUrls, function(self, link){
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
            products.push(asins);
        });
    });
});

// 生成待爬图表url
casper.then(function(){
    for(var i=0; i<products.length; i++){
        var asins = products[i];
        var links = [];
        for(var j=0; j<asins.length; j++){
            var asin = asins[j];
            for(var k=0; k<CHART_NUM; k++){
                links.push(chartUrlPrefix + '?url=' + chartUrls[k] + 
                    '&param={asin:' + asin + '}&type=' + chartTypes[k] + '&name=' + chartNames[k]);
            }
        }
        pages.push(links);
    }
});

// 依次爬取图表
casper.then(function(){
    for(var i=0; i<pages.length; i++){
        (function(that, path, urls){
            that.each(urls, function(self, link){
                console.log(link);
                var params = (link.split('?')[1]).split('&');
                var param = eval('(' + params[1].split('=')[1].replace(/\b\w+\b/g, '"$&"') + ')');
                var asin = param['asin'];
                var chartName = params[3].split('=')[1];

                self.thenOpen(link, function(){
                    self.waitFor(function check(){
                        return self.evaluate(function(){
                            return document.querySelectorAll('.blockUI').length == 0;
                        });
                    }, function then(){
                        console.log('fuck ' + path + ' ' + asin + ' ' + chartName);
                        self.captureSelector(ROOT + '/' + path + '/' + asin + '/' + 
                            chartName + '-' + TIME + '.png', '#chart');
                    });
                });
            });
        })(this, categoryPaths[i], pages[i]);
    }
});

casper.run();
