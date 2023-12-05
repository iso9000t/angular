import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  const email = localStorage.getItem('email');

  if (token && uid && email) {
    const modifiedReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('rs-uid', uid)
        .set('rs-email', email)
    });
    return next(modifiedReq);
  }

  return next(req);
};
