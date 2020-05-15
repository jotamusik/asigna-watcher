import { OrderState } from './OrderState';


const stateMatchers = [
  { matchString: '', state: OrderState.unknown },
  { matchString: 'REGISTRADA', state: OrderState.sent },
  { matchString: 'RECEPCIONADA', state: OrderState.asignaReceived },
  { matchString: 'CONFLICTIVA', state: OrderState.noDelivery },
  { matchString: 'EN REPARTO', state: OrderState.onWay },
  { matchString: 'ENTREGADA', state: OrderState.received },
];

const matchStates = (response) : OrderState => {
  return <OrderState>stateMatchers
    .map(item => response.match(new RegExp(item.matchString)) ? item.state : null)
    .filter(possibleOrderState => possibleOrderState != null)
    .pop();
}

export const getActualState = (orderWebResponse: string) : OrderState => {
  return matchStates(orderWebResponse);
};
