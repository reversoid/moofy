import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { WrapperComponent } from '../wrapper/wrapper.component';
import { NotificationService } from '../../utils/notification.service';
import { TuiAlertService } from '@taiga-ui/core';
import { mergeMap, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, WrapperComponent, FooterComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [TuiDestroyService],
})
export class LayoutComponent implements OnInit {
  constructor(
    private readonly alert: TuiAlertService,
    private readonly notificationService: NotificationService,
    private readonly _destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.initializeNotifications();
  }

  initializeNotifications() {
    const DURATION = 1500;

    this.notificationService.errors$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'error', autoClose: DURATION })),
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe();

    this.notificationService.notifications$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'info', autoClose: DURATION })),
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe();

    this.notificationService.successMessages$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'success', autoClose: DURATION })),
      )
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }
}
