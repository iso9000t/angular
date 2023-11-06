import { Component } from "@angular/core";

import { LoginService } from "../../services/login.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    constructor(private loginService: LoginService) {}

    onLogin(): void {
        if (this.username && this.password) {
            this.loginService.login(this.username, this.password);
        } else {
            console.log("No username or password");
        }
    }
}
