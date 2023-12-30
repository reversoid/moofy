import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';
import { TUI_SANITIZER } from '@taiga-ui/core';
import { NgDompurifySanitizer, NgDompurifyModule } from '@tinkoff/ng-dompurify';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), UNIVERSAL_PROVIDERS],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
