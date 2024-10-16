import {
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class UserGateway {
  constructor() {}
}
