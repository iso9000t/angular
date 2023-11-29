import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { LoginService } from "../../services/login.service";
import { passwordStrengthValidator } from "../../validators/password.validator";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    constructor(private fb: FormBuilder, private loginService: LoginService) {}
    loginForm = this.fb.group({
        username: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, passwordStrengthValidator()]],
    });
    onLogin(): void {
        if (this.loginForm.valid) {
            const username = this.loginForm.value.username!;
            const password = this.loginForm.value.password!;
            this.loginService.login(username, password);
        } else {
            console.log("No username or password");
        }
    }
}
