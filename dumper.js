var Dumper = require('mongo-dumper').DatabaseToFileDumper;

var settings = {
    hosts: 'ec2-54-245-205-128.us-west-2.compute.amazonaws.com:27017',
    authentication : {
        database : 'clinisis',
        user : 'root',
        password : ''
    },
    output: {
        timestampLabel : 'YYYY-MM-DD_HH-mm-ss',
        prefix : 'lambda'
    }
};

var mongoDumper = new Dumper(settings);

mongoDumper.transport();
