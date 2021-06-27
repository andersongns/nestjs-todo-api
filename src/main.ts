import { ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform.interceptor'

async function bootstrap (): Promise<void> {
  const logger = new Logger('main.ts')
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT || 3000)
  logger.log(`Application listen port ${process.env.PORT}`)
}
bootstrap()
