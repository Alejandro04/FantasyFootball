import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiCountryResponse } from './country.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamV2Service {
  private urlCountries = "https://api-football-v1.p.rapidapi.com/v3/teams"

  constructor(
    private http: HttpClient
  ) { }

  getCountries(): Observable<any[]>{
    const league = 1;
    const season = 2022;
    //return this.http.get<any>(`${this.urlCountries}?league=${league}&season=${season}`).pipe(
    return this.http.get<ApiCountryResponse>(`./assets/countries.json`).pipe(  
    map((apiresponse) => apiresponse.response.map((country:any) => ({
        id: country.team.id,
        name: country.team.name,
        logo: country.team.logo
      }))),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }
}
