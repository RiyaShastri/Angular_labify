import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  apiUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/permissions`);
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res.data));
  }

  createRole(name: string, permissions: number[]): Observable<any> {
    return this.http.post(this.apiUrl, {
      name,
      permissions,
    });
  }

  updateRole(id: number, name: string, permissions: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      name,
      permissions,
    });
  }

  deleteRole(roleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roleId}`);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http
      .get<any>(`${this.apiUrl}/${roleId}`)
      .pipe(map((res) => res.data));
  }
}
