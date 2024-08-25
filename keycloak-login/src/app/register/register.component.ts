import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <form (submit)="onRegister($event)">
        <ion-item>
          <ion-label position="floating">Username</ion-label>
          <ion-input [(ngModel)]="username" [ngModelOptions]="{standalone: true}" type="text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input [(ngModel)]="email" [ngModelOptions]="{standalone: true}" type="email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input [(ngModel)]="password" [ngModelOptions]="{standalone: true}" type="password"></ion-input>
        </ion-item>
        <ion-button expand="full" type="submit">Register</ion-button>
      </form>
      <ion-text color="danger" *ngIf="errorMessage">{{ errorMessage }}</ion-text>
      <ion-text color="success" *ngIf="successMessage">{{ successMessage }}</ion-text>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private keycloakService: KeycloakService) {}

  async onRegister(event: Event) {
    event.preventDefault();  // Prevent the default form submission

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Keycloak admin operations (such as user creation) should be handled through backend APIs.
      // This example assumes such an endpoint exists. You should replace the following line with an appropriate service call.
      const response = await this.createUser(this.username, this.email, this.password);
      this.successMessage = 'User registered successfully!';
    } catch (error) {
      this.errorMessage = 'Error creating user';
    }
  }

  async createUser(username: string, email: string, password: string) {
    // This method should be implemented in your backend service that communicates with Keycloak
    throw new Error('createUser method should be implemented in a backend service.');
  }
}
