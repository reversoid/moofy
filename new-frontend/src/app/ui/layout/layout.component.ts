import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';
import { mergeMap, takeUntil } from 'rxjs';
import { NotificationService } from '../../utils/notification.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

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
    private readonly destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.initializeAppNotifications();
  }

  private initializeAppNotifications() {
    const DURATION = 1500;

    this.notificationService.errors$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'error', autoClose: DURATION })),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.notificationService.notifications$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'info', autoClose: DURATION })),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.notificationService.successMessages$
      .pipe(
        mergeMap((message) => this.alert.open(message, { status: 'success', autoClose: DURATION })),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
