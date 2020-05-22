import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import { BadRequest, Ok } from "../../lib";

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });
const cloudWatchEvent = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })
const FunctionName = process.env.functionName || '';
const RuleName = process.env.ruleName || '';
const ScheduleExpression = process.env.scheduleExpression || '';
const emailNotificatorTopicArn = process.env.emailNotificatorTopicArn || '';

interface RequestBody {
  orderId: number;
  action: string;
}

function requestBodyIsNotValid({ orderId, action }: RequestBody) {
  return !orderId || !action || (action !== 'ENABLED' && action !== 'DISABLED');
}

export const activateOrDeactivateWatcher: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
  const { orderId, action }: RequestBody = JSON.parse(event.body as string);

  if ( requestBodyIsNotValid({ orderId, action }) ) {
    return BadRequest({ message: 'OrderId and Action needed' });
  }

  await cloudWatchEvent.putRule({
    Name: RuleName,
    State: action,
    ScheduleExpression,
  }).promise();

  await lambda.updateFunctionConfiguration({
    FunctionName,
    Environment: {
      Variables: { 'orderId': orderId.toString(), emailNotificatorTopicArn }
    },
  }).promise();

  console.log({ orderId, action });

  return Ok();
};
