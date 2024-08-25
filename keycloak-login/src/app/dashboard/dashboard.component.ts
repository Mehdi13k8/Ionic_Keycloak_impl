import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  template: `
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
      <ion-content class="ion-padding">
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <div *ngIf="userInfo && userInfo.username">
        <p>Username: {{ userInfo.username }}</p>
        <p>Email: {{ userInfo.email }}</p>
      </div>
    </div>
    </ion-content>
  </ion-app>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  userInfo: any;

  constructor(private keycloakService: KeycloakService) { }

  ngOnInit() {
    alert("gg");
    this.loadUserInfo();
  }

  async loadUserInfo() {
    try {
      const userProfile = await this.keycloakService.loadUserProfile();
      console.log('User profile:', userProfile);
      this.userInfo = {
        username: userProfile.username,
        email: userProfile.email,
      };
      console.log('User info:', this.userInfo);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
}
