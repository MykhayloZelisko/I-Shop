import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';
import { User } from '../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { GqlAuthGuard } from '../common/guards/gql-auth/gql-auth.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';

@Resolver(() => Order)
export class OrdersResolver {
  public constructor(private ordersService: OrdersService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  public async createOrder(
    @Args('createOrderInput', ValidationPipe)
    createOrderInput: CreateOrderInput,
    @Context() context: { req: { user: User } },
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderInput, context.req.user);
  }

  @Query(() => [Order], { name: 'userOrders' })
  @UseGuards(GqlAuthGuard)
  public async getAllOrdersByUserId(
    @Context() context: { req: { user: User } },
  ): Promise<Order[]> {
    const params = { user: context.req.user.id };
    return this.ordersService.getAllOrders(params);
  }

  @Query(() => [Order], { name: 'orders' })
  @UseGuards(GqlAdminGuard)
  public async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders({});
  }

  // @Query(() => Order, { name: 'order' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.ordersService.findOne(id);
  // }

  @Mutation(() => Order)
  @UseGuards(GqlAdminGuard)
  public async updateOrder(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args('updateOrderInput', ValidationPipe)
    updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderInput);
  }

  // @Mutation(() => Order)
  // removeOrder(@Args('id', { type: () => Int }) id: number) {
  //   return this.ordersService.remove(id);
  // }
}
