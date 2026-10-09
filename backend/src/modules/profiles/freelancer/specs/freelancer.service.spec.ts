import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { FreelancerService } from '../freelancer.service.js';
import { Freelancer } from '../schema/freelancer.schema.js';
import { messages } from '../../../../common/libs/messages.js';

vi.mock('../../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('FreelancerService', () => {
  let service: FreelancerService;

  const freelancerModel = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreelancerService,
        { provide: getModelToken(Freelancer), useValue: freelancerModel },
      ],
    }).compile();

    service = module.get(FreelancerService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ─────────── findMe / findOne (same behaviour) ───────────
  describe.each(['findMe', 'findOne'] as const)('%s', (method) => {
    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(service[method]('user-1')).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
    });

    it('should return the freelancer of the given user', async () => {
      const freelancer = { id: 'freelancer-1', userId: 'user-1' };
      freelancerModel.findOne.mockResolvedValue(freelancer);

      const result = await service[method]('user-1');

      expect(freelancerModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(result).toEqual({ data: freelancer, message: null });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-1', { about: 'x' } as any),
      ).rejects.toThrow(new NotFoundException(messages.freelancer.notFound));
    });

    it('should update only the fields that are not undefined', async () => {
      const freelancer = {
        id: 'freelancer-1',
        update: vi.fn().mockResolvedValue(undefined),
      };
      freelancerModel.findOne.mockResolvedValue(freelancer);

      const result = await service.update('user-1', {
        about: 'New about',
        skills: ['nestjs'],
        website: undefined,
      } as any);

      expect(freelancer.update).toHaveBeenCalledWith({
        about: 'New about',
        skills: ['nestjs'],
      });
      expect(result).toEqual({ data: freelancer, message: null });
    });

    it('should keep falsy-but-defined values (null, empty string, 0)', async () => {
      const freelancer = { update: vi.fn().mockResolvedValue(undefined) };
      freelancerModel.findOne.mockResolvedValue(freelancer);

      await service.update('user-1', {
        website: null,
        about: '',
        completedOrders: 0,
      } as any);

      expect(freelancer.update).toHaveBeenCalledWith({
        website: null,
        about: '',
        completedOrders: 0,
      });
    });
  });
});
