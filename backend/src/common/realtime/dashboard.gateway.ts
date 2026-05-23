import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class DashboardGateway {
  @WebSocketServer() server: Server;

  emitDashboardUpdate(payload: Record<string, unknown>) {
    this.server.emit('dashboard:update', payload);
  }
}
