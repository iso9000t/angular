import { inject } from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot
} from "@angular/router";

import { LoginService } from "../services/login.service";

export const authGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
) => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (loginService.isLoggedIn()) {
        return true;
    }

    return router.parseUrl("/login");
};
