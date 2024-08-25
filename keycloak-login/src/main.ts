import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';




bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
  ],
}).catch(err => console.log(err));
