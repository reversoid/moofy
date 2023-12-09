import { Module } from '@nestjs/common';
import { UnnoficialKpService } from './proxy-realizations/unofficial-kp/unnoficial-kp.service';
import { HttpModule } from '@nestjs/axios';
import { ExternalFilmApiService } from './external-film-api.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  providers: [UnnoficialKpService, ExternalFilmApiService],
  exports: [ExternalFilmApiService],
})
export class ExternalFilmProxyModule {}
