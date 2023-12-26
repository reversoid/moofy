import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TuiAvatarModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
