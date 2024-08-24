import { bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';

// function initializeKeycloak(keycloak: KeycloakService) {
//   return () => keycloak.init({
//     config: {
//       url: 'https://keycloak.pi.chezo.hu/',
//       realm: 'mehdi',
//       clientId: 'ionic-keycloak-login',
//     },
//     initOptions: {
//       onLoad: 'check-sso', // Checks if the user is already logged in
//       checkLoginIframe: false,
//     },
//   });
// }

bootstrapApplication(AppComponent, {
  providers: [
    { provide: IonicRouteStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(KeycloakAngularModule),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
  ],
});
