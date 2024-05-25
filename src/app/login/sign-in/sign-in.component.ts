import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  constructor(
    private keycloakService: KeycloakService
  ) { }

  async ngOnInit() {
    await this.keycloakService.init();
    await this.keycloakService.login();
  }

  // user: User = new User();

  // login(): void {
  //   console.log(this.user);
  // }
}
