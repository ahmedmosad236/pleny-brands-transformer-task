import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DbTestService implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    console.log('MongoDB Status:', this.connection.readyState);
  }
}