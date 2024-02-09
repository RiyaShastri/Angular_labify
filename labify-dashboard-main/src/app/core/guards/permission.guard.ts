import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  withDebugTracing,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AuthService, USER_KEY } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  userPermissions!: string[];
  routePermission: string | undefined;
  currentLink!: string;

  constructor(
    private storageServices: StorageService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentLink = router.url;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.routePermission = route.data['permission'];
    this.userPermissions =
      this.storageServices.getLocalStorageValue(USER_KEY)?.permissions;

    if (!this.userPermissions || !this.userPermissions?.length) {
      this.authService.logout();
      this.storageServices.clearLocalStorage();
      this.storageServices.clearSessionStorage();
      this.router.navigate(['/auth/login']);
      return false;
    } else if (
      this.routePermission &&
      this.userPermissions.includes(this.routePermission)
    )
      return true;
    else {
      this.router.navigate([this.currentLink]);
      return false;
    }
  }
}
