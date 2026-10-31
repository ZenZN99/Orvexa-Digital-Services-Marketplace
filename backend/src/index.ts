import { corsMiddleware, loggerMiddleware, RiserBob } from 'riser-bob';
import { FRONTEND_URL } from './url';
import { Modules } from './modules';
import { connectDB } from './config/db/connect-db';
import { RedisConfig } from './config/db/redis/redis-config';
import { PresenceGateway } from './config/gateways/presence.gateway';
import { TokenManager } from './config/token/token';
import { AuthSocketAdapter } from './config/adapters/socket.adapter';

export const redisConfig = new RedisConfig();

async function bootstrap() {
  const bob = new RiserBob({funnyMode: false});

  await connectDB();

  await redisConfig.connect();

  bob.spongUse(
    corsMiddleware({
      origin: FRONTEND_URL,
      credentials: true,
    }),
  );
  bob.spongUse(loggerMiddleware);

  bob.spongGet('/', async (spongReq, spongRes) => {
    return spongRes.json({ message: 'Welcome to Bikini Bottom! 🍍' });
  });

  const io = bob.spongSocketIO({
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });

  const tokenManager = new TokenManager();
  const authSocketAdapter = new AuthSocketAdapter(tokenManager);

  authSocketAdapter.initialize(io);

  const presenceGateway = new PresenceGateway(io);

  io.on('connection', (socket) => {
    presenceGateway.handleConnection(socket);

    socket.on('disconnect', () => {
      presenceGateway.handleDisconnect(socket);
    });
  });

  Modules(bob, io);

  bob.spongListen(4000, () => {
    console.log('🧽 RiserBob is running at http://localhost:4000 🍍');
  });
}

bootstrap().catch((error: unknown) => {
  console.error('[RiserBob] Failed to start application:', error);
  process.exit(1);
});
