import { Router } from "@angular/router";

import { LoginService } from "./login.service";

class MockRouter {
    navigate = jest.fn();
}

describe("LoginService", () => {
    let service: LoginService;
    let mockRouter: MockRouter;

    beforeEach(() => {
        mockRouter = new MockRouter();
        service = new LoginService(mockRouter as unknown as Router);
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should login and navigate to /main", () => {
        service.login("user", "pass");
        expect(localStorage.getItem("authToken")).toBe("fakeToken");
        expect(mockRouter.navigate).toHaveBeenCalledWith(["/main"]);
    });

    it("should logout and navigate to /login", () => {
        service.logout();
        expect(localStorage.getItem("authToken")).toBeNull();
        expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("should be able to check if user is logged in", () => {
        expect(service.isLoggedIn()).toBeFalsy();
        service.login("user", "pass");
        expect(service.isLoggedIn()).toBeTruthy();
    });

    it("should return the correct username", () => {
        service.login("user", "pass");
        expect(service.getUsername()).toBe("user");
    });

    it("should observe isLoggedIn status", (done) => {
        service.isLoggedInObservable().subscribe((isLoggedIn) => {
            expect(isLoggedIn).toBeTruthy();
            done();
        });
        service.login("user", "pass");
    });
});
