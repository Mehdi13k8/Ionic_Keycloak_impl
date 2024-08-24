import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import axios from 'axios';  // Import axios for making HTTP requests

@Component({
    selector: 'app-login',
    template: `
    <ion-app>
        <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <form (submit)="onLogin($event)">
        <div class="form-item">
          <label>Username</label>
          <input [(ngModel)]="username" [ngModelOptions]="{standalone: true}" type="text" required />
        </div>
        <div class="form-item">
          <label>Password</label>
          <input [(ngModel)]="password" [ngModelOptions]="{standalone: true}" type="password" required />
        </div>
        <button type="submit" class="full-width-button">Login</button>
      </form>
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
  `],
    standalone: true,
    imports: [IonicModule, FormsModule], // Add the necessary Ionic and Angular modules here
})
export class LoginComponent {
    username = 'admin';
    password = 'admin';

    constructor() { }

    async onLogin(event: Event) {
        event.preventDefault();  // Prevent the default form submission
        const tokens = await this.ropcLogin(this.username, this.password);
        console.log('Logged tokens =>', tokens);
    }

    public async refreshToken(refreshToken: string) {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', 'ionic-keycloak-login');
        params.append('refresh_token', refreshToken);
        params.append('client_secret', 'lBNAzsY1q7CxlP6xyulupmK2c2es1Hlc'); // Your client secret

        try {
            const response = await axios.post('https://keycloak.pi.chezo.hu/realms/mehdi/protocol/openid-connect/token', params);
            const data = response.data;

            const newAccessToken = data.access_token;
            const newRefreshToken = data.refresh_token;

            // Save the new tokens in local storage
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            console.log('Token refreshed:', newAccessToken);

            if (!newAccessToken) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }

            // Schedule the next token refresh before the current token expires
            setTimeout(() => {
                this.refreshToken(newRefreshToken);
            }, 1000 * 60 * 5); // Refresh the token every 5 minutes

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };

        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }

    async ropcLogin(username: string, password: string) {
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

            const data = await response.json();
            const accessToken = data.access_token;
            const refreshTokenVar = data.refresh_token;

            // Save tokens in local storage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshTokenVar);

            // Schedule the token refresh
            setTimeout(() => {
                this.refreshToken(refreshTokenVar);
            }, 1000 * 60 * 5); // Refresh the token every 5 minutes

            return { accessToken, refreshToken: refreshTokenVar };

        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }
}
