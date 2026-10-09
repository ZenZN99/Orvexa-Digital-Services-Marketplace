export const generateCartItems = (createdCarts, createdServices) => {
    const cartItems = [];
    for (let i = 0; i < createdCarts.length; i++) {
        const cart = createdCarts[i];
        const itemCount = 1 + (i % 4);
        const usedServiceIds = new Set();
        for (let j = 0; j < itemCount; j++) {
            const service = createdServices[(i * itemCount + j) % createdServices.length];
            if (!service || usedServiceIds.has(service.id)) {
                continue;
            }
            usedServiceIds.add(service.id);
            cartItems.push({
                cartId: cart.id,
                serviceId: service.id,
            });
        }
    }
    return cartItems;
};
//# sourceMappingURL=cart-items.js.map