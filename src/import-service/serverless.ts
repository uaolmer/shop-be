import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  useDotenv: true,
  package: {
    individually: true,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    client: {
      bucketName: '${env:BUCKET}',
    },
    s3BucketName: '${self:custom.client.bucketName}',
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: [
          {
            'Fn::Join': ['', ['arn:aws:s3:::', {Ref: 'ImportS3Bucket'}]]
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: [
          {
            'Fn::Join': ['', ['arn:aws:s3:::', {Ref: 'ImportS3Bucket'}, '/*']]
          }
        ],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    stage: 'dev',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      ImportS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.s3BucketName}',
          CorsConfiguration: {
            CorsRules: [
              { 
                AllowedHeaders: ['*'], 
                AllowedMethods: ['GET', 'PUT', 'DELETE'], 
                AllowedOrigins: ['*'],
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
