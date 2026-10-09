export function sanitizeUser(user: any) {
  const obj = user.get({ plain: true });

  const { password, refreshToken, ...safe } = obj;

  return safe;
}
