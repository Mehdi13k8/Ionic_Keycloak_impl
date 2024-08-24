import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode
import axios from 'axios';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
    selector: 'app-dashboard',
    template: `
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <div *ngIf="userInfo && userInfo?.username">
        <p>Username: {{ userInfo.username }}</p>
        <p>Email: {{ userInfo.email }}</p>
      </div>
    </div>
  `,
    standalone: true,
    imports: [IonicModule, CommonModule], // Add CommonModule to the imports array
})
export class DashboardComponent implements OnInit {
    userInfo: any;

    ngOnInit() {
        this.loadUserInfo();
    }

    async loadUserInfo() {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken && accessToken !== 'undefined') {
            console.log('Access token found:', accessToken);
            // Decode the token to get user info if present
            try {
                const decodedToken: any = jwtDecode(accessToken);
                this.userInfo = {
                    username: decodedToken.preferred_username,
                    email: decodedToken.email,
                };
                console.log('User info:', this.userInfo);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }
}
