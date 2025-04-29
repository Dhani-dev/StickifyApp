import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { SongsComponent } from './pages/songs/songs.component';
import { AuthorsComponent } from './pages/authors/authors.component';

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
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'playlist',
        component: PlaylistComponent
    },
    {
        path: 'songs',
        component: SongsComponent
    },
    {
        path: 'authors',
        component: AuthorsComponent
    }
];
