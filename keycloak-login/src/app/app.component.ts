import { APP_INITIALIZER, Component, NgZone } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { CommonModule } from '@angular/common';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import {HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';  // Update the path accordingly

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-header *ngIf="isLoggedIn">
        <ion-toolbar>
          <ion-title>My App</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="logout()">Disconnect</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ng-container *ngIf="isLoggedIn; else loginTemplate">
          <app-dashboard></app-dashboard>
        </ng-container>
        <ng-template #loginTemplate>
          <ion-button expand="full" (click)="login()">Login with Keycloak</ion-button>
        </ng-template>
      </ion-content>
    </ion-app>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, KeycloakAngularModule, DashboardComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppComponent {
  isLoggedIn = false;

  constructor(
    private platform: Platform,
    private keycloakService: KeycloakService,
    private ngZone: NgZone
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    this.keycloakService.init({
      config: {
        url: 'https://keycloak.pi.chezo.hu/',
        realm: 'mehdi',
        clientId: 'ionic-keycloak-login',
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: 'http://keycloaklogin.com/assets/silent-check-sso.html',
      },
    }).then(async () => {
      this.isLoggedIn = await this.keycloakService.isLoggedIn();
      console.log('Is logged in:', this.isLoggedIn);

      if (this.isLoggedIn) {
        this.ngZone.run(() => {
          this.isLoggedIn = true;
        });
      }

      // Handle app URL open for OAuth redirect
      Browser.addListener('browserPageLoaded', async () => {
        // listen to all http requests
        console.log('Browser page loaded');
        //  interceptor
 

      });
    }).catch(err => {
      console.error('Keycloak initialization failed', err);
    });
  }

  async login() {
    const keycloak = this.keycloakService.getKeycloakInstance();
    let redirectUri = 'http://keycloaklogin.com'; // Custom URL scheme
    // if pc
    if (!Capacitor.isNativePlatform()) {
      redirectUri = 'http://localhost:4200';
    }

    let loginUrl = keycloak.createLoginUrl({
      redirectUri: redirectUri,
      scope: 'openid',
    });

    // Manually set redirect_uri if needed
    const url = new URL(loginUrl);
    url.searchParams.set('redirect_uri', redirectUri);
    loginUrl = url.toString();

    console.log('Login URL:', loginUrl);

    keycloak.login({
      redirectUri: redirectUri,
    });
    // await Browser.open({ url: loginUrl });
  }

  async exchangeCodeForTokens(code: string) {
    const tokenUrl = 'https://keycloak.pi.chezo.hu/realms/mehdi/protocol/openid-connect/token';
    const clientId = 'ionic-keycloak-login';

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', clientId);
    body.append('code', code);
    body.append('redirect_uri', 'http://keycloaklogin.com');
    body.append('client_secret', 'lBNAzsY1q7CxlP6xyulupmK2c2es1Hlc');

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        this.ngZone.run(() => {
          this.isLoggedIn = true;
        });
      } else {
        console.error('Token exchange failed', data);
      }
    } catch (error) {
      console.error('Error exchanging code for tokens', error);
    }
  }

  async logout() {
    await this.keycloakService.logout();
    this.isLoggedIn = false;
  }
}
