import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../utilities/pagination';
import { UserRole } from './schemas/enums/users.enum';
import type { UsersService } from './users.service';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.usersService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        users: result.safeUsers,
        pagination: result.pagination,
      },
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const { id } = spongReq.params;

    if (!id) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await this.usersService.findOne(id);

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly updateRole: SpongHandler = async (spongReq, spongRes) => {
    const { id } = spongReq.params;
    const { role } = await spongReq.json<{ role: UserRole }>();

    if (!id) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await this.usersService.updateRole(id, role);

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }
    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
    });
  };

  readonly block: SpongHandler = async (spongReq, spongRes) => {
    const adminId = spongReq.user!.id;
    const { id } = spongReq.params;

    if (!id) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await this.usersService.block(adminId, id);

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
    });
  };
}
