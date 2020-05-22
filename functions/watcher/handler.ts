import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';

import { getActualState, getStateQueryResponse, OrderState, OrderStateMessage } from "../../lib";

const orderId = process.env.orderId || '';
const TopicArn = process.env.emailNotificatorTopicArn || '';
const SNS = new AWS.SNS({ apiVersion: "2010-03-31" });

export const watcher: Handler = async () => {
  const stateQueryResponse: string = await getStateQueryResponse(orderId);
  const orderState: OrderState = getActualState(stateQueryResponse);

  const statusDate = new Date();
  const statusDateFormated = `${statusDate.getDay()}/${statusDate.getMonth()}/${statusDate.getFullYear()} - ${statusDate.getHours()}:${statusDate.getMinutes()}`;
  const Message = JSON.stringify({
    date: statusDateFormated,
    orderState: OrderStateMessage[orderState]
  });
  await SNS.publish({ Message, TopicArn }).promise();

  return;
}
