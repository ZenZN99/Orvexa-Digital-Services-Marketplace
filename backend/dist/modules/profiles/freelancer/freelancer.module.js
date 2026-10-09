var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Freelancer } from './schema/freelancer.schema.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { FreelancerController } from './freelancer.controller.js';
import { FreelancerService } from './freelancer.service.js';
import { User } from '../../users/schema/user.schema.js';
let FreelancerModule = class FreelancerModule {
};
FreelancerModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Freelancer, User]), TokenModule],
        controllers: [FreelancerController],
        providers: [FreelancerService],
    })
], FreelancerModule);
export { FreelancerModule };
//# sourceMappingURL=freelancer.module.js.map