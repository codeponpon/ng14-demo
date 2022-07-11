import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const AUTH_API = 'http://vpmpttapi1.gptthailand.com';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(user_name: string, password: string): Observable<any> {
    return this.http
      .post(
        AUTH_API + '/api/v1/login',
        {
          user_name,
          password,
        },
        httpOptions
      )
      .pipe(tap((_) => console.log('user login')));
  }
  register(
    user_name: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        user_name,
        email,
        password,
      },
      httpOptions
    );
  }
  logout(): Observable<any> {
    return this.http.post(AUTH_API + '/api/v1/logout', {}, httpOptions);
  }
  profile(access_token: string): Observable<any> {
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      `Bearer ${access_token}`
    );
    console.log('httpOptions', httpOptions);

    return this.http
      .get(AUTH_API + '/api/v1/users/me?includes[]=activeProjects', httpOptions)
      .pipe(
        tap((_) => console.log('fetched user profile')),
        catchError(this.handleError('get profile', []))
      );
  }

  // Private Method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
