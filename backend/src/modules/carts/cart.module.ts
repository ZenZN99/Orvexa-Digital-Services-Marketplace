import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './schema/cart.schema.js';
import { CartItem } from './schema/cart-item.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { User } from '../users/schema/user.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart, CartItem, Service, User]),
    TokenModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
