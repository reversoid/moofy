import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SearchProxyController } from './searchProxy.controller';
import { ExternalMovieProxyService } from './externalMovieProxy.service';
import { OfficialKpService } from './proxyRealizations/official.kp.service';
import { UnofficialKpService } from './proxyRealizations/unofficial.kp.service';

@Module({
  controllers: [SearchProxyController],
  imports: [HttpModule],
  providers: [
    ExternalMovieProxyService,
    OfficialKpService,
    UnofficialKpService,
  ],
  exports: [ExternalMovieProxyService],
})
export class ExternalMovieProxyModule {}
