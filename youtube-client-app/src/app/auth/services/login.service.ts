import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    constructor(private router: Router) {}

    login(username: string, password: string) {
        localStorage.setItem("authToken", "fakeToken");
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        this.router.navigate(["/main"]);
        console.log("User validated");
    }
    // eslint-disable-next-line class-methods-use-this
    logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.router.navigate(["/login"]);
    }
    // eslint-disable-next-line class-methods-use-this
    isLoggedIn(): boolean {
        return Boolean(localStorage.getItem("authToken"));
    }
    // eslint-disable-next-line class-methods-use-this
    getUsername(): string {
        return localStorage.getItem("username") || "Sign in";
    }
}
