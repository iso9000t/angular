import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    constructor(private router: Router) {}

    private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(
        this.isLoggedIn()
    );

    login(username: string, password: string) {
        localStorage.setItem("authToken", "fakeToken");
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        this.router.navigate(["/main"]);
        this.isLoggedInSubject.next(true);
    }
    // eslint-disable-next-line class-methods-use-this
    logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.isLoggedInSubject.next(false);
        this.router.navigate(["/login"]);
    }
    // eslint-disable-next-line class-methods-use-this
    isLoggedIn(): boolean {
        return Boolean(localStorage.getItem("authToken"));
    }
    // eslint-disable-next-line class-methods-use-this
    getUsername(): string {
        return localStorage.getItem("username") || "";
    }
    isLoggedInObservable(): Observable<boolean> {
        return this.isLoggedInSubject;
    }
}
