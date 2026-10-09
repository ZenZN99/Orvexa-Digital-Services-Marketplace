import { Injectable, NotFoundException } from '@nestjs/common';
import { Freelancer } from './schema/freelancer.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';
import { UpdateFreelancerDTO } from './dto/update.js';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FreelancerService {
  constructor(@InjectModel(Freelancer) private readonly freelancerModel: typeof Freelancer) {}

  async findMe(userId: string) {
    const freelancer = await this.freelancerModel.findOne({
      where: { userId },
    });

    if (!freelancer) {
      throw new NotFoundException(messages.freelancer.notFound);
    }

    return response(freelancer, null);
  }
  async findOne(userId: string) {
    const freelancer = await this.freelancerModel.findOne({
      where: { userId },
    });

    if (!freelancer) {
      throw new NotFoundException(messages.freelancer.notFound);
    }

    return response(freelancer, null);
  }

  async update(userId: string, data: UpdateFreelancerDTO) {
    const freelancer = await this.freelancerModel.findOne({
      where: { userId },
    });

    if (!freelancer) {
      throw new NotFoundException(messages.freelancer.notFound);
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    await freelancer.update(updateData);

    return response(freelancer, null);
  }
}
