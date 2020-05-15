import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
// import * as AWS from 'aws-sdk';

// const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });
// const cloudWatchEvent = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })
// const FunctionName = process.env.functionName || '';
// const RuleName = process.env.ruleName || '';

import 'source-map-support/register';
import { BadRequest, getActualState, getStateQueryResponse, Ok, OrderState } from "../../lib";

interface RequestBody {
  orderId: number;
}

export const activator: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {

  const { orderId }: RequestBody = JSON.parse(event.body as string);

  if ( !orderId ) {
    return BadRequest({ message: 'OrderId needed' });
  }

  // const rules = await cloudWatchEvent.describeRule({ Name: RuleName }).promise();

  // const newConfiguration: UpdateFunctionConfigurationRequest = {
  //   FunctionName,
  //   Environment: {
  //     Variables: {
  //     'orderId': orderId,
  //     }
  //   }
  // }
  //
  // await lambda.updateFunctionConfiguration(newConfiguration).promise();

  const stateQueryResponse: string = await getStateQueryResponse(orderId);
  const orderState: OrderState = getActualState(stateQueryResponse);
  return Ok({ orderState: OrderState[orderState] });
}
