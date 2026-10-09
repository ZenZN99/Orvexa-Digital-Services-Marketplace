var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { Freelancer } from './schema/freelancer.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';
import { InjectModel } from '@nestjs/sequelize';
let FreelancerService = class FreelancerService {
    freelancerModel;
    constructor(freelancerModel) {
        this.freelancerModel = freelancerModel;
    }
    async findMe(userId) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        return response(freelancer, null);
    }
    async findOne(userId) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        return response(freelancer, null);
    }
    async update(userId, data) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const updateData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
        await freelancer.update(updateData);
        return response(freelancer, null);
    }
};
FreelancerService = __decorate([
    Injectable(),
    __param(0, InjectModel(Freelancer)),
    __metadata("design:paramtypes", [Object])
], FreelancerService);
export { FreelancerService };
//# sourceMappingURL=freelancer.service.js.map