import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let isLoggedIn = false;
  if (isLoggedIn) {
    return true;
  } else {
    return false;
  }
};
