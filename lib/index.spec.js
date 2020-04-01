"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-shadowed-variable */
/* tslint:disable:no-unused-variable */
const test = require("blue-tape");
const util = require("util");
const index_1 = require("./index");
const config = require('../my_config.json');
console.log('config', config);
test('aws-cli-js', t => {
    t.test('iam list-users', t => {
        const options = new index_1.Options(
        /* accessKey    */ config.accessKeyId, 
        /* secretKey    */ config.secretAccessKey, 
        /* sessionToken */ config.sessionToken, 
        /* currentWorkingDirectory */ undefined);
        const aws = new index_1.Aws(options);
        return aws.command('iam list-users').then((data) => {
            console.log('data = ', util.inspect(data, { depth: 10 }));
            t.ok(data);
            t.ok(data.object.Users);
        });
    });
    t.test('command sanitizer', t => {
        t.equals('test  touch HACKED', index_1.AwsCommandSanitizer.sanitize('test | touch HACKED'));
        t.equals('test touch HACKED ', index_1.AwsCommandSanitizer.sanitize('test; touch HACKED; #'));
        t.equals('test touch HACKED2', index_1.AwsCommandSanitizer.sanitize('test; $(touch HACKED2)'));
        t.equals('ls echo  HACKED', index_1.AwsCommandSanitizer.sanitize('ls echo > HACKED'));
        t.equals('aws codecommit create-repository --repository-name new-repository  HACKED', index_1.AwsCommandSanitizer.sanitize('aws codecommit create-repository --repository-name new-repository > HACKED'));
        t.equals('aws s3 mb s3://tgsbucket --region us-west-2', index_1.AwsCommandSanitizer.sanitize('aws s3 mb s3://tgsbucket --region us-west-2'));
        t.equals('aws s3 presign s3://tgsbucket/dnsrecords.txt', index_1.AwsCommandSanitizer.sanitize('aws s3 presign s3://tgsbucket/dnsrecords.txt'));
        t.equals('ec2 describe-instances --instance-ids i-789b3ba7', index_1.AwsCommandSanitizer.sanitize('ec2 describe-instances --instance-ids i-789b3ba7'));
    });
});
