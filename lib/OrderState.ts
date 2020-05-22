export enum OrderState {
  unknown,
  sent,
  asignaReceived,
  onWay,
  noDelivery,
  received,
}

export enum OrderStateMessage {
  "Paquete sin traquear",
  "Pedido enviado",
  "Recibido en Canarias",
  "En reparto",
  "No sale a reparto, recogalo ud.",
  "Pedido entregado, ya deberias tenerlo",
}
