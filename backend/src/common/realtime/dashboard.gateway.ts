import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { getCorsOrigins } from '../security/env';
import { getJwtSecret } from '../security/env';

@WebSocketGateway({
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
})
export class DashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const raw =
      (client.handshake.auth?.token as string | undefined) ||
      (typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
        : undefined);

    if (!raw) {
      client.disconnect(true);
      return;
    }

    try {
      const decoded = this.jwtService.verify<{ pharmacyId?: string }>(raw, {
        secret: getJwtSecret(),
      });
      if (!decoded.pharmacyId) {
        client.disconnect(true);
        return;
      }
      const room = `pharmacy:${decoded.pharmacyId}`;
      await client.join(room);
      client.data.pharmacyId = decoded.pharmacyId;
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(_client: Socket) {
    /* rooms cleaned up automatically */
  }

  emitDashboardUpdate(pharmacyId: string, payload: Record<string, unknown>) {
    this.server.to(`pharmacy:${pharmacyId}`).emit('dashboard:update', payload);
  }
}
