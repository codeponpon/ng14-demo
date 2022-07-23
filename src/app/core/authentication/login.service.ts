import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core/bootstrap/menu.service';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiEndpoint: string = environment.baseUrl + environment.baseAPIV1;
  constructor(protected http: HttpClient, private tokenService: TokenService) {}

  login(user_name: string, password: string, rememberMe = false) {
    return this.http.post<Token>(
      this.apiEndpoint + '/login',
      {
        user_name,
        password,
      },
      httpOptions
    );
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    const bearerToken = this.tokenService.getBearerToken();
    httpOptions.headers = httpOptions.headers.set('Authorization', bearerToken);
    return this.http.post<any>(this.apiEndpoint + '/logout', {}, httpOptions);
  }

  me(params = ''): Observable<any> {
    const bearerToken = this.tokenService.getBearerToken();
    httpOptions.headers = httpOptions.headers.set('Authorization', bearerToken);
    return this.http.get(
      this.apiEndpoint + '/users/me?includes[]=activeProjects' + params,
      httpOptions
    );
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/assets/data/menu.json').pipe(map(res => res.menu));
  }
}
