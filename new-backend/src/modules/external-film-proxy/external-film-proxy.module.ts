import { Module } from '@nestjs/common';
import { UnnoficialKpService } from './proxy-realizations/unofficial-kp/unnoficial-kp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  providers: [UnnoficialKpService],
})
export class ExternalFilmProxyModule {}
