var ROOT = 'temp/test';
var productLink = 'http://trendata.cn/mp/productDetail/?asin=B008GR4L18&field=wig';
var sellerLink = 'http://trendata.cn/mp/sellerDetail/?field=wig&name=Cool2dayINC';

var productChartTargets = [
    '#starsBlock',
    '#infoBlock',
    'body'
];
var productChartNames = [
    'starsInfoShot',
    'productInfoShot',
    'fullScreen'
];
var sellerChartTargets = [
    '#starsBlock',
    '#infoBlock',
    '#reviewCompete',
    'body'
];
var sellerChartNames = [
    'starsInfoShot',
    'sellerInfoShot',
    'reviewCompeteInfoShot',
    'fullScreen'
];

var casper = require('casper').create({
    viewportSize: {
        width: 440,
        height: 800
    }
});
casper.start();

casper.thenOpen(productLink, function(){
    for(var i=0; i<productChartTargets.length; i++){
        this.captureSelector(ROOT + '/p-' + productChartNames[i] + '.png', productChartTargets[i]);
    }
});

casper.thenOpen(sellerLink, function(){
    for(var i=0; i<sellerChartTargets.length; i++){
        this.captureSelector(ROOT + '/s-' + sellerChartNames[i] + '.png', sellerChartTargets[i]);
    }
});

casper.run();