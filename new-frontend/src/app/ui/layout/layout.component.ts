import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, WrapperComponent, FooterComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
