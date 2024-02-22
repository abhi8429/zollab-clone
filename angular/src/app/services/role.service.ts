import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment, SERVICE_STELLA_CHAT, SERVICE_ZOLLAB} from "../../environments/environment";
import {Role, RolePermission} from "../model/role";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getRoles(teamId: number):Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/roles/`)
  }

  getProjectRoles(teamId: number, projectId: number):Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/roles/`)
  }

  //Remove all below
  createRole(workspaceId: number, roleName: string, roleDesc: string):Observable<Role> {
    return this.http.post<Role>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/roles/`,{roleName: roleName, roleDesc: roleDesc});
  }

  getRolePermissions(workspaceId: number, roleId: number):Observable<RolePermission> {
    return this.http.get<RolePermission>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/roles/${roleId}/permissions/`);
  }

  updateRolePermissions(workspaceId: number, roleId: number, rolePermissions: any):Observable<RolePermission> {
    return this.http.put<RolePermission>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/roles/${roleId}/permissions/`, rolePermissions);
  }

  updateRole(workspaceId: number, roleId: number, roleName: string, roleDesc: string) {
    return this.http.patch<Role>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/roles/${roleId}`,{roleName: roleName, roleDesc: roleDesc});
  }

  updateMembersRole(workspaceId: number, modifiedMembers: any) {
    return this.http.put(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/members/bulk`, modifiedMembers);
  }

  get userId(): number {
    return this.userService.userId;
  }
}
