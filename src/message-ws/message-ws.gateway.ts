import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from "socket.io";
import { NewMessageDto } from "./dtos/new-message.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../auth/interfaces";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection,OnGatewayDisconnect{

  @WebSocketServer() wss:Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ){}

  async handleConnection(client: Socket){
    const  token = client.handshake.headers.authentication as string;
    let payload : JwtPayload;
    //verifico token
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    }catch (e) {
      client.disconnect();
      return;
    }

    //notificar a todos --- (eventName)
    this.wss.emit('clients-update', this.messageWsService.getConnectedClients())


  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messageWsService.removeclient(client.id);
    // console.log({conectados: this.messageWsService.getConnectedClients()});

    this.wss.emit('clients-update', this.messageWsService.getConnectedClients());

  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  handleMessageFromCliente(client: Socket, payload: NewMessageDto){
    // Para solo a la persona que le envia el mensaje.
    // client.emit('message-from-server',{
    //   fullName: 'lalala!',
    //   message: payload.message || 'no-message!!!'
    // });

    // Para todos excepto al cliente inicial.
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'lalala!',
    //   message: payload.message || 'no-message!!!'
    // });

    //Para emitir de ambos lados
    this.wss.emit('message-from-server',{
        fullName: this.messageWsService.getUserFullName(client.id) + ':',
        message: payload.message || 'no-message!!!'
      });

  }
}
