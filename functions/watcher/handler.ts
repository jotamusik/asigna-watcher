import { APIGatewayProxyHandler } from 'aws-lambda';

import 'source-map-support/register';
import { Ok } from "../../lib";

export const watcher: APIGatewayProxyHandler = async () => {
  console.log('Hello world!');
  return Ok({ message: 'Hello World!' });
}
