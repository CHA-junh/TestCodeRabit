import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OracleService } from './database.provider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${configService.get<string>('DB_HOST')})(PORT=${configService.get<number>('DB_PORT')}))(CONNECT_DATA=(SERVICE_NAME=${configService.get<string>('DB_SERVICE')})))`,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, //  configService.get<string>('NODE_ENV') !== 'production',
        logging: true, // SQL 쿼리 로깅 ?�성??
        logger: 'advanced-console', // ?�세??로깅
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OracleService],
  exports: [OracleService, TypeOrmModule],
})
export class DatabaseModule {}


