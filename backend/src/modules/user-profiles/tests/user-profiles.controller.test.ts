import { describe, expect, it, mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { UserProfilesController } from '../user-profiles.controller';

type Req = Parameters<SpongHandler>[0];
type Res = Parameters<SpongHandler>[1];
type Deps = ConstructorParameters<typeof UserProfilesController>;

const makeRes = () => {
  const calls: Array<{ method: string; body: unknown }> = [];

  const handler = (method: string) => (body: unknown) => {
    calls.push({ method, body });
    return body;
  };

  const res = {
    SpongOK: handler('SpongOK'),
    SpongNotFound: handler('SpongNotFound'),
    SpongUnprocessableContent: handler('SpongUnprocessableContent'),
  } as unknown as Res;

  return { res, calls };
};

const makeReq = (fields: Record<string, string | File>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  return {
    user: { id: 'u1' },
    formData: async () => formData,
  } as unknown as Req;
};

const makeFile = (name: string) =>
  new File(['data'], name, { type: 'image/png' });

const build = (options: {
  saveFails?: boolean;
  failUploadFor?: string;
  failDestroyFor?: string;
}) => {
  const profile = {
    avatar: { publicId: 'old-avatar', url: 'old-avatar-url' },
    cover: { publicId: 'old-cover', url: 'old-cover-url' },
    bio: 'old bio',
    save: mock(async () => {
      if (options.saveFails) {
        throw new Error('db down');
      }
    }),
  };

  const upload = mock(async (_file: File, folder: string) => {
    if (options.failUploadFor === folder) {
      throw new Error('upload failed');
    }

    return { publicId: `new:${folder}`, url: `url:${folder}` };
  });

  const destroy = mock(async (publicId: string) => {
    if (options.failDestroyFor === publicId) {
      throw new Error('destroy failed');
    }
  });

  const controller = new UserProfilesController(
    { findOne: mock(async () => profile) } as unknown as Deps[0],
    { upload, destroy } as unknown as Deps[1],
  );

  return { controller, profile, upload, destroy };
};

describe('UserProfilesController.update', () => {
  it('returns 422 for an invalid bio and does not upload anything', async () => {
    const { controller, upload, profile } = build({});
    const { res, calls } = makeRes();

    await controller.update(
      makeReq({ bio: 'ab', avatar: makeFile('a.png') }),
      res,
    );

    expect(calls[0]?.method).toBe('SpongUnprocessableContent');
    expect(upload).not.toHaveBeenCalled();
    expect(profile.save).not.toHaveBeenCalled();
  });

  it('clears the bio when an empty string is sent', async () => {
    const { controller, profile } = build({});
    const { res, calls } = makeRes();

    await controller.update(makeReq({ bio: '   ' }), res);

    expect(profile.bio).toBeNull();
    expect(calls[0]?.method).toBe('SpongOK');
  });

  it('leaves everything untouched when no field is sent', async () => {
    const { controller, profile, upload, destroy } = build({});
    const { res } = makeRes();

    await controller.update(makeReq({}), res);

    expect(profile.bio).toBe('old bio');
    expect(profile.avatar.publicId).toBe('old-avatar');
    expect(upload).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
  });

  it('updates only the avatar and deletes only the old avatar', async () => {
    const { controller, profile, destroy } = build({});
    const { res } = makeRes();

    await controller.update(makeReq({ avatar: makeFile('a.png') }), res);

    expect(profile.avatar.publicId).toBe('new:user-profiles/avatars');
    expect(profile.cover.publicId).toBe('old-cover');
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledWith('old-avatar');
  });

  it('removes the new avatar and keeps the old images when the cover upload fails', async () => {
    const { controller, profile, destroy } = build({
      failUploadFor: 'user-profiles/covers',
    });
    const { res } = makeRes();

    await expect(
      controller.update(
        makeReq({ avatar: makeFile('a.png'), cover: makeFile('c.png') }),
        res,
      ),
    ).rejects.toThrow('upload failed');

    expect(destroy).toHaveBeenCalledWith('new:user-profiles/avatars');
    expect(destroy).not.toHaveBeenCalledWith('old-avatar');
    expect(profile.save).not.toHaveBeenCalled();
  });

  it('removes the new images and keeps the old ones when the save fails', async () => {
    const { controller, destroy } = build({ saveFails: true });
    const { res } = makeRes();

    await expect(
      controller.update(makeReq({ avatar: makeFile('a.png') }), res),
    ).rejects.toThrow('db down');

    expect(destroy).toHaveBeenCalledWith('new:user-profiles/avatars');
    expect(destroy).not.toHaveBeenCalledWith('old-avatar');
  });

  it('still succeeds when deleting the old image fails after the save', async () => {
    const { controller, profile } = build({ failDestroyFor: 'old-avatar' });
    const { res, calls } = makeRes();

    await controller.update(makeReq({ avatar: makeFile('a.png') }), res);

    expect(profile.save).toHaveBeenCalledTimes(1);
    expect(calls[0]?.method).toBe('SpongOK');
  });
});
