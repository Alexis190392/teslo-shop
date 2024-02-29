import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

interface ConnectedClients{
  [id: string]: {
    socket:Socket,
    user: User
  }
}

@Injectable()
export class MessageWsService {

  private connectedClients: ConnectedClients = {}

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}


  async registerClient( client: Socket, userId: string){

    const user= await this.userRepository.findOneBy({id:userId});
    if (!user) throw new Error('Usuario no existe');
    if (!user.isActive) throw new Error('Usuario inactivo');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user
    };
  }

  removeclient( clientId: string){
    delete this.connectedClients[clientId]
  }

  getConnectedClients(): string[]{
    // return Object.keys(this.connectedClients).length;
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId:string){
    return this.connectedClients[socketId].user.fullName;
  }

  //para desconectar duplicados
  private checkUserConnection(user: User){
    for (const clientId of Object.keys(this.connectedClients)) {

      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id){
        //lo desconecto de la conexion anterior
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
