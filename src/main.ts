  import { bootstrapApplication } from '@angular/platform-browser';
  import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
  import { AppComponent } from './app/app.component';
  import { provideRouter } from '@angular/router';
  import { routes } from './app/app.routes'; // si tienes rutas

  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideRouter(routes) // si no tienes rutas, puedes omitir esto
    ]
  }).catch(err => console.error(err));
