import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-52-44-31-100.compute-1.amazonaws.com',
      port: 5432,
      username: 'sxzvytdaygdxpi',
      password: 'd53044b98858be72dc510a11353ffb069c502016a7826ceb7ccb5a21b5c66b3d',
      database: 'd870esooa0j972',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
