import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Freelancer } from './schema/freelancer.schema.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { FreelancerController } from './freelancer.controller.js';
import { FreelancerService } from './freelancer.service.js';
import { User } from '../../users/schema/user.schema.js';

@Module({
  imports: [SequelizeModule.forFeature([Freelancer, User]), TokenModule],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class FreelancerModule {}
