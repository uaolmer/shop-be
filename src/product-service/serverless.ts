import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, createProduct } from '@functions/index';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  package: {
    individually: true,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST,
      PG_PORT,
      PG_DATABASE,
      PG_USERNAME,
      PG_PASSWORD,
    },
    lambdaHashingVersion: '20201221',
    stage: 'dev',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
};

module.exports = serverlessConfiguration;
