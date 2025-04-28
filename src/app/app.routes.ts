import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent
    },
    {
        path: 'sign-in',
        component: SignInComponent
    },
    {
        path: 'log-in',
        component: LogInComponent
    },
    {
        path: 'home',
        component: HomeComponent
    }
];
