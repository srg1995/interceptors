import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('interceptors');
  protected authService = inject(AuthService);

  handlerLogin(): void {
    this.authService.refreshToken();
  }
  ngOnInit(): void {
    this.authService.login('test', '1234').subscribe({
      next: (res) => {
        console.log('Token recibido:', res.token);
      },
      error: (err) => console.log(err),
    });
  }
}
