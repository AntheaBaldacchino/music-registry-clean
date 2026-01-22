import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  styleUrl: './app.scss',
  standalone: true,
  template: `
    <app-header />
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .container { padding: 16px; max-width: 1100px; margin: 0 auto; }
  `]
})
export class App {}
