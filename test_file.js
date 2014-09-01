var fs = require('fs');
fs.write('test_data.txt', '', 'w');

var TEST_LINK = 'http://www.amazon.com/gp/product/B004J3Y9U6';
// var TEST_LINK = 'http://www.amazon.cn/dp/B004QEZ6H8';
// var TEST_LINK = 'http://item.jd.com/1068557.html';

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'
    },
    // verbose: true,
    // logLevel: "error",
    // timeout: 5000
});
casper.start();

casper.then(function(){
    for(var i=1; i<200; i++){
        (function(self, i){
            self.thenOpen(TEST_LINK, function(status){
                // console.log(status);

                self.waitForSelector('#priceblock_ourprice',
                    function then(){
                        var data = self.evaluate(function(){
                            return document.querySelector('#priceblock_ourprice').innerText;
                        });
                        var text = i + ' ' + data;
                        console.log(text);
                        fs.write('data.txt', text + '\r\n', 'a');
                    },
                    function onTimeout(){
                        console.log('wait selector timeout');
                    },
                    timeout = 5000
                );
                
                /*var data = self.evaluate(function(){
                    return document.querySelector('#priceblock_ourprice').innerText;
                });
                var text = i + ' ' + data;
                console.log(text);
                fs.write('data.txt', text + '\r\n', 'a');*/
            });
        })(this, i);
    }
});

casper.run();