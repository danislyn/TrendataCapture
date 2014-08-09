var fs = require('fs');
var casper = require('casper').create();
casper.start('http://www.amazon.com/gp/product/B004J3Y9U6', function(){
    var data = this.evaluate(function(){
        return document.querySelector('#priceblock_ourprice').innerText;
    });
    console.log(data);
    fs.write('data.txt', data, 'w');
});

casper.run();