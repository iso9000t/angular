import { HttpInterceptorFn } from "@angular/common/http";

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
    const apiKey = "AIzaSyBdeaDIpUtECD0Sjo7vMYigtawKdaIGZss";

    const separator = req.url.includes("?") ? "&" : "?";

    const modifiedReq = req.clone({
        url: `${req.url}${separator}key=${apiKey}`,
    });

    return next(modifiedReq);
};
