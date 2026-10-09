import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './schema/order.schema.js';
import { Cart } from '../carts/schema/cart.schema.js';
import { CartItem } from '../carts/schema/cart-item.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { User } from '../users/schema/user.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Cart, CartItem, User]),
    TokenModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
