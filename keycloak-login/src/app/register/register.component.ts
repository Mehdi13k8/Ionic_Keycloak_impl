import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <ion-app>

    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <form (submit)="onRegister($event)">
        <div class="form-item">
          <label>Username</label>
          <input [(ngModel)]="username" [ngModelOptions]="{standalone: true}" type="text" required />
        </div>
        <div class="form-item">
          <label>Email</label>
          <input [(ngModel)]="email" [ngModelOptions]="{standalone: true}" type="email" required />
        </div>
        <div class="form-item">
          <label>Password</label>
          <input [(ngModel)]="password" [ngModelOptions]="{standalone: true}" type="password" required />
        </div>
        <button type="submit" class="full-width-button">Register</button>
      </form>
      <div *ngIf="errorMessage" class="message error">{{ errorMessage }}</div>
      <div *ngIf="successMessage" class="message success">{{ successMessage }}</div>
    </ion-content>
    </ion-app>
  `,
  styles: [`
    .form-item {
      margin: 15px 0;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .full-width-button {
      width: 100%;
      padding: 10px;
      background-color: #3880ff;
      color: white;
      border: none;
      border-radius: 4px;
      text-align: center;
      font-size: 16px;
      margin-top: 10px;
    }
    .full-width-button:hover {
      background-color: #4c8dff;
    }
    .message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    .message.error {
      background-color: #f8d7da;
      color: #721c24;
    }
    .message.success {
      background-color: #d4edda;
      color: #155724;
    }
  `],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  async onRegister(event: Event) {
    event.preventDefault();  // Prevent the default form submission

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const adminToken = await this.getAdminToken('admin', 'admin');
      const realm = 'mehdi'; // Your realm name
      await this.createUser(realm, adminToken, this.username, this.email, this.password);
      this.successMessage = 'User registered successfully!';
    } catch (error) {
      this.errorMessage = 'Error creating user.';
    }
  }

  async createUser(realm: string, accessToken: string, username: string, email: string, password: string) {
    const userRepresentation = {
      username: username,
      email: email,
      enabled: true,
      credentials: [{
        type: "password",
        value: password,
        temporary: false
      }]
    };

    try {
      const response = await axios.post(
        `https://keycloak.pi.chezo.hu/admin/realms/${realm}/users`,
        userRepresentation,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('User created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAdminToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'ionic-keycloak-login');
    params.append('username', username);
    params.append('password', password);
    params.append('client_secret', 'lBNAzsY1q7CxlP6xyulupmK2c2es1Hlc'); // Your client secret

    try {
      const response = await fetch('https://keycloak.pi.chezo.hu/realms/mehdi/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      let data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error obtaining admin token:', error);
      throw error;
    }
  }
}
