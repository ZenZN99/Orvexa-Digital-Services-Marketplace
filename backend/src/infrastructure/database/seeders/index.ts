import { Sequelize } from 'sequelize-typescript';
import { generateSupportConversations } from './support-conversations.js';
import { generateSupportMessages } from './support-messages.js';
import { generateServices } from './services.js';
import { platformWallets } from './platform-wallets.js';
import { generateOrders } from './orders.js';
import { generatePayments } from './payments.js';
import { generateContracts } from './contracts.js';
import { generateReviews } from './reviews.js';
import { generateNotifications } from './notifications.js';
import { generateCartItems } from './cart-items.js';
import { User } from '../../../modules/users/schema/user.schema.js';
import { users } from './users.js';
import { UserVerification } from '../../../modules/user-verifications/schema/user-verification.schema.js';
import { generateUserProfiles } from './user-profiles.js';
import { generateFreelancers } from './freelancers.js';
import { Freelancer } from '../../../modules/profiles/freelancer/schema/freelancer.schema.js';
import { SupportConversation } from '../../../modules/supports/coversations/schema/support-conversation.schema.js';
import { SupportMessage } from '../../../modules/supports/messages/schema/support-message.schema.js';
import { PlatformWallet } from '../../../modules/platform-wallets/schema/platform-wallet.schema.js';
import { Order } from '../../../modules/orders/schema/order.schema.js';
import { Payment } from '../../../modules/payments/schema/payment.schema.js';
import { Contract } from '../../../modules/contracts/schema/contract.schema.js';
import { Review } from '../../../modules/reviews/schema/review.schema.js';
import { generateCarts } from './cart.js';
import { Cart } from '../../../modules/carts/schema/cart.schema.js';
import { CartItem } from '../../../modules/carts/schema/cart-item.schema.js';
import { generaetUserVerifications } from './user-verifications.js';
import { UserProfile } from '../../../modules/profiles/user-profiles/schema/user-profile.schema.js';
import { Service } from '../../../modules/services/schema/service.schema.js';
import { Notification } from '../../../modules/notifications/schema/notification.schema.js';

export async function runSeeders(sequelize: Sequelize) {
  console.log('🚀 Starting Database Seed...');

  const createdUsers = await User.bulkCreate(users);

  console.log(`✅ Users seeded: ${createdUsers.length}`);

  const userVerifications = generaetUserVerifications(createdUsers);

  await UserVerification.bulkCreate(userVerifications);

  console.log(`✅ User verifications seeded: ${userVerifications.length}`);

  const userProfiles = generateUserProfiles(createdUsers);

  await UserProfile.bulkCreate(userProfiles);

  console.log(`✅ User profiles seeded: ${userProfiles.length}`);

  const freelancerData = generateFreelancers(createdUsers);

  const createdFreelancers = await Freelancer.bulkCreate(freelancerData);

  console.log(`✅ Freelancers seeded: ${createdFreelancers.length}`);

  const supportConversationData = generateSupportConversations(createdUsers);

  const createdSupportConversations = await SupportConversation.bulkCreate(
    supportConversationData,
  );

  console.log(
    `✅ Support conversations seeded: ${createdSupportConversations.length}`,
  );

  const supportMessageData = generateSupportMessages(
    createdSupportConversations,
    createdUsers,
  );

  await SupportMessage.bulkCreate(supportMessageData);

  console.log(`✅ Support messages seeded: ${supportMessageData.length}`);

  const serviceData = generateServices(createdFreelancers);

  const createdServices = await Service.bulkCreate(serviceData);

  console.log(`✅ Services seeded: ${createdServices.length}`);

  await PlatformWallet.bulkCreate(platformWallets);

  console.log(`✅ Platform wallets seeded: ${platformWallets.length}`);

  const orderData = generateOrders(createdUsers, createdServices);

  const createdOrders = await Order.bulkCreate(orderData);

  console.log(`✅ Orders seeded: ${createdOrders.length}`);

  const paymentData = generatePayments(createdOrders);

  await Payment.bulkCreate(paymentData);

  console.log(`✅ Payments seeded: ${paymentData.length}`);

  const contractData = generateContracts(createdOrders);

  const createdContracts = await Contract.bulkCreate(contractData);

  console.log(`✅ Contracts seeded: ${createdContracts.length}`);

  const reviewData = generateReviews(createdContracts);

  await Review.bulkCreate(reviewData);

  console.log(`✅ Reviews seeded: ${reviewData.length}`);

  const notificationData = generateNotifications(
    createdUsers,
    createdContracts,
  );

  await Notification.bulkCreate(notificationData);

  console.log(`✅ Notifications seeded: ${notificationData.length}`);

  const cartData = generateCarts(createdUsers);

  const createdCarts = await Cart.bulkCreate(cartData);

  console.log(`✅ Carts seeded: ${createdCarts.length}`);

  const cartItemData = generateCartItems(createdCarts, createdServices);

  await CartItem.bulkCreate(cartItemData);

  console.log(`✅ Cart items seeded: ${cartItemData.length}`);

  console.log('🎉 Database Seed Completed Successfully');
}
