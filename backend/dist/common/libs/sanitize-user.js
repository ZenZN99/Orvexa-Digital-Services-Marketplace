export function sanitizeUser(user) {
    const obj = user.get({ plain: true });
    const { password, refreshToken, ...safe } = obj;
    return safe;
}
//# sourceMappingURL=sanitize-user.js.map