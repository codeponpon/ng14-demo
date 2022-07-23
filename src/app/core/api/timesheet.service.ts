import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core/authentication';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  apiEndpoint: string = environment.baseUrl + environment.baseAPIV1;
  constructor(private tokenService: TokenService, protected http: HttpClient) {}

  getAllTasks(params: any): Observable<any> {
    const bearerToken = this.tokenService.getBearerToken();
    httpOptions.headers = httpOptions.headers.set('Authorization', bearerToken);
    return this.http.get(this.apiEndpoint + '/dailytimesheets?' + $.param(params), httpOptions);
  }
}
