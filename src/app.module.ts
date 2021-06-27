import { Module } from '@nestjs/common'
import { TodoModule } from './todo/todo.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configValidationSchema } from './config.schema'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false
          }
        }
      }
    }),
    TodoModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
