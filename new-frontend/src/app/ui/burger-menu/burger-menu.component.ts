import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurgerMenuComponent {
  @Input() sidebarOpen = false;

  @Output() sidebarOpenChange = new EventEmitter<boolean>();

  toggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarOpenChange.emit(this.sidebarOpen);
  }
}
