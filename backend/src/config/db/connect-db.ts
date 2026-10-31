import { sequelize } from './sequelize';
import { setupAssociations } from './associations';

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();

    console.log('Database connected successfully.');

    setupAssociations();

    await sequelize.sync();

    console.log('All database tables synchronized successfully.');
  } catch (error) {
    console.error('Failed to connect or synchronize database:', error);
    throw error;
  }
}
