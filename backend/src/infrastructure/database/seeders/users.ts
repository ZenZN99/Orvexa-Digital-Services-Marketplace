import bcrypt from 'bcryptjs';
import { UserRole } from '../../../common/enums/user.enum.js';


const PASSWORD = '1234567890';

const firstNames = [
  'Ahmed',
  'Mohammed',
  'Omar',
  'Ali',
  'Youssef',
  'Hassan',
  'Khaled',
  'Mahmoud',
  'Ibrahim',
  'Zaid',
  'Karim',
  'Tarek',
  'Sami',
  'Adam',
  'Yasin',
  'Amir',
  'Daniel',
  'David',
  'James',
  'Michael',
  'John',
  'Robert',
  'William',
  'Thomas',
  'George',
  'Alex',
  'Ryan',
  'Daniel',
  'Lucas',
  'Noah',
  'Liam',
  'Ethan',
  'Mason',
  'Oliver',
  'Leo',
  'Jack',
  'Henry',
  'Sophia',
  'Emma',
  'Sara',
  'Lina',
  'Maya',
  'Nour',
  'Layla',
  'Mariam',
  'Hana',
  'Dina',
  'Rana',
  'Aya',
];

const lastNames = [
  'Ahmed',
  'Hassan',
  'Ali',
  'Mahmoud',
  'Saleh',
  'Khalil',
  'Nasser',
  'Ibrahim',
  'Othman',
  'Mansour',
  'Hamdan',
  'Farouk',
  'Karim',
  'Saeed',
  'Youssef',
  'Abbas',
  'George',
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Wilson',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Robinson',
  'Clark',
  'Lewis',
  'Walker',
  'Hall',
  'Young',
];

const roles = [UserRole.CLIENT, UserRole.FREELANCER];

const generateUsers = async () => {
  const password = await bcrypt.hash(PASSWORD, 10);

  const users = [];

  users.push({
    firstName: 'Orvexa',
    lastName: 'Admin',
    email: 'admin@orvexa.com',
    password,
    role: UserRole.ADMIN,
    refreshToken: null,
    isActive: true,
    balance: 0,
    frozenBalance: 0,
    lastLoginAt: null,
  });

  for (let i = 1; i <= 9999; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const role = roles[Math.floor(Math.random() * roles.length)];

    users.push({
      firstName,
      lastName,
      email: `user${i}@orvexa.com`,
      password,
      role,
      refreshToken: null,
      isActive: true,
      balance: Math.floor(Math.random() * 10000),
      frozenBalance: Math.floor(Math.random() * 2000),
      lastLoginAt: null,
    });
  }

  return users;
};

export const users = await generateUsers();
