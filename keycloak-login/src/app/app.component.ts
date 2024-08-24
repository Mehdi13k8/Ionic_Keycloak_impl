import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <!-- Header displayed only when the user is logged in -->
      <ion-header *ngIf="isLoggedIn">
        <ion-toolbar>
          <ion-title>My App</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="logout()">Disconnect</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <!-- Content displayed based on authentication state -->
      <ion-content>
        <div *ngIf="isLoggedIn">
          <app-dashboard></app-dashboard>
        </div>

        <!-- Display login or register form based on the state -->
        <div *ngIf="!isLoggedIn">
          <div *ngIf="showLogin">
          <app-login>
            </app-login>
          </div>

          <div *ngIf="!showLogin">
            <app-register></app-register>
          </div>
        </div>
      </ion-content>
      <button class="toggle-button" (click)="toggleView()"> {{ toggleButton }} </button>

    </ion-app>
  `,
  styles: [`
    .toggle-button {
      display: block;
      width: 100%;
      padding: 10px;
      margin-top: 20px;
      background-color: #3880ff;
      color: white;
      border: none;
      border-radius: 4px;
      text-align: center;
      font-size: 16px;
    }
    .toggle-button:hover {
      background-color: #4c8dff;
    }
  `],
  standalone: true,
  imports: [IonicModule, LoginComponent, DashboardComponent, RegisterComponent, CommonModule],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showLogin = true; // This controls whether the login or register view is shown
  toggleButton = "Don't have an account? Register here.";
  private tokenCheckInterval: any;

  ngOnInit() {
    // Initial check on component initialization
    this.checkAuthentication();

    // Set up interval to check authentication status every minute
    this.tokenCheckInterval = setInterval(() => {
      this.checkAuthentication();
    }, 3000); // 60,000 milliseconds = 1 minute
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  /**
   * Checks if the access token is present in localStorage.
   * Updates the isLoggedIn state accordingly.
   */
  private checkAuthentication() {
    const accessToken = localStorage.getItem('accessToken');
    this.isLoggedIn = !!accessToken;
  }

  /**
   * Logs the user out by clearing tokens and updating the authentication state.
   */
  logout() {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Update authentication state
    this.isLoggedIn = false;
  }

  /**
   * Toggles between the login and register views.
   */
  toggleView() {
    this.showLogin = !this.showLogin;
    this.toggleButton = this.showLogin ? "Don't have an account? Register here." : "Already have an account? Log in here.";
  }
}
