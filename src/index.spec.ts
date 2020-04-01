/* tslint:disable:no-shadowed-variable */
/* tslint:disable:no-unused-variable */
import test = require('blue-tape');
import * as path from 'path';
import * as util from 'util';
import { Aws, Options, AwsCommandSanitizer } from './index';

const config = require('../my_config.json');

console.log('config', config);

test('aws-cli-js', t => {

  t.test('iam list-users', t => {
    const options = new Options(
      /* accessKey    */ config.accessKeyId,
      /* secretKey    */ config.secretAccessKey,
      /* sessionToken */ config.sessionToken,
      /* currentWorkingDirectory */ undefined,
    );


    const aws = new Aws(options);

    return aws.command('iam list-users').then( (data: any) => {
      console.log('data = ', util.inspect(data, { depth: 10 }));
      t.ok(data);
      t.ok(data.object.Users);
    });

  });

  t.test('command sanitizer', t => {
    t.equals('test  touch HACKED',
      AwsCommandSanitizer.sanitize('test | touch HACKED'));
    t.equals('test touch HACKED ',
      AwsCommandSanitizer.sanitize('test; touch HACKED; #'));
    t.equals('test touch HACKED2',
      AwsCommandSanitizer.sanitize('test; $(touch HACKED2)'));
    t.equals('ls echo  HACKED',
      AwsCommandSanitizer.sanitize('ls echo > HACKED'));
    t.equals(
      'codecommit create-repository --repository-name new-repository  HACKED',
      AwsCommandSanitizer.sanitize(
        'codecommit create-repository --repository-name new-repository > HACKED'));
    t.equals('s3 mb s3://tgsbucket --region us-west-2',
      AwsCommandSanitizer.sanitize('s3 mb s3://tgsbucket --region us-west-2'));
    t.equals('s3 presign s3://tgsbucket/dnsrecords.txt',
      AwsCommandSanitizer.sanitize('s3 presign s3://tgsbucket/dnsrecords.txt'));
    t.equals('ec2 describe-instances --instance-ids i-789b3ba7',
      AwsCommandSanitizer.sanitize('ec2 describe-instances --instance-ids i-789b3ba7'));
    t.end();
  });
});
