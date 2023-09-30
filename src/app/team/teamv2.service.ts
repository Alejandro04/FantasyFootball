import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiCountryResponse } from './country.interface';
import { ApiCouchResponse, CouchResponse } from './coach.interface';
import { ApiPlayerResponse, Player } from './player.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamV2Service {
  private urlCountries = "https://api-football-v1.p.rapidapi.com/v3/teams"
  private urlTeam = "https://api-football-v1.p.rapidapi.com/v3/players/squads"
  private urlCoach = "https://api-football-v1.p.rapidapi.com/v3/coachs"
  private playerSubject = new Subject<Player>();
  private coachSubject = new Subject<CouchResponse>();
  player$ = this.playerSubject.asObservable();
  coach$ = this.coachSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getCountries(): Observable<any[]>{
    const league = 1;
    const season = 2022;
    //return this.http.get<ApiCountryResponse>(`${this.urlCountries}?league=${league}&season=${season}`).pipe(
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

  getTeam(teamID:number): Observable<any[]>{
     return this.http.get<any>(`./assets/team.json`).pipe(
     //return this.http.get<ApiPlayerResponse>(`${this.urlTeam}?team=${teamID}`).pipe(  
        map((apiresponse) => apiresponse.response.map((team:any) => {
          return team.players;
        })),
        map((players) => players[0].map((player:any) => {
            return {
              id: player.id,
              name: player.name,
              position: player.position,
              photo: player.photo
            }
        })),
          catchError((error) => {
            console.error('Error en la solicitud HTTP:', error);
            return of([]);
          })
        );
  }

  getCoach(teamID: number): Observable<any[]>{
    return this.http.get<ApiCouchResponse>(`./assets/coach.json`).pipe(  
    //return this.http.get<ApiCouchResponse>(`${this.urlCoach}?team=${teamID}`).pipe( 
     map((apiresponse) => apiresponse.response.map((coach:any) => ({
          id: coach.id,
          name: coach.name,
          photo: coach.photo
        }))),
        catchError((error) => {
          console.error('Error en la solicitud HTTP:', error);
          return of([]);
        })
      );
  }

  sendPlayer(player: Player) {
    this.playerSubject.next(player);
  }

  sendCoach(coach: CouchResponse) {
    this.coachSubject.next(coach);
  }
}
