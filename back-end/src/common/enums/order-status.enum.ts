import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatusEnum {
  PendingConfirmation = 'Pending Confirmation',
  Confirmed = 'Confirmed',
  AwaitingPayment = 'Awaiting Payment',
  Paid = 'Paid',
  AwaitingShipment = 'Awaiting Shipment',
  Shipped = 'Shipped',
  Canceled = 'Canceled',
}

registerEnumType(OrderStatusEnum, {
  name: 'status',
  description: 'Order status',
});
