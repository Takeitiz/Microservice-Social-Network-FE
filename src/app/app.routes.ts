import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsfeedComponent } from './dashboard/newsfeed/newsfeed.component';

export const routes: Routes = [
    {
        path: 'home', component: DashboardComponent,
        children: [
            {
                path: '', component: NewsfeedComponent,
            },
        ]
    },
    {
        path: 'auth', component: LoginComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: SignInComponent },
            { path: 'signup', component: SignUpComponent }
        ]
    },
];
