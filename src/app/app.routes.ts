import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';

export const routes: Routes = [
    {
        path: 'auth', component: LoginComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: SignInComponent },
            { path: 'signup', component: SignUpComponent }
        ]
    }
];
