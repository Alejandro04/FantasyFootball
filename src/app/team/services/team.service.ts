import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiLeagueResponse, League, LeagueResponse } from '../interfaces/league.interface';
import { PlayerParam } from '../interfaces/playerParams.interface';
import { ApiPlayerResponse, PlayerResponse } from '../interfaces/player.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private leagueApiUrl = "https://api-football-v1.p.rapidapi.com/v3/leagues";
  private playerApiUrl = "https://api-football-v1.p.rapidapi.com/v3/players";
  private playerListSubject = new Subject;
  playerList$ = this.playerListSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  searchLeague(param: string): Observable<any[]> {
    //return this.http.get<ApiLeagueResponse>(`${this.leagueApiUrl}?search=${param}`).pipe(
    return this.http.get<ApiLeagueResponse>('./assets/league.json').pipe(
      map((apiresponse) => apiresponse.response.map((league) => ({
        id: league.league.id,
        name: league.league.name,
        country: league.country.name
      }))),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        // Devolver un observable vacío para que el flujo de datos continúe
        return of([]);
      })
    );
  }

  searchPlayer(params: PlayerParam): Observable<any[]> {
    const leagueID = params.leagueID;
    const player = params.player;

    //return this.http.get<ApiPlayerResponse>(`${this.playerApiUrl}?league=${leagueID}&search=${player}`).pipe(
    return this.http.get<ApiPlayerResponse>('./assedts/player.json').pipe(
      map((apiresponse) => apiresponse.response.map((player) => ({
        id: player.player.id,
        name: player.player.name,
        photo: player.player.photo,
        age: player.player.age,
        nationality: player.player.nationality,
        position: player.statistics[0].games.position,
        teamID: player.statistics[0].team.id,
        teamName: player.statistics[0].team.name
      }))),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        // Devolver un observable vacío para que el flujo de datos continúe
        return of([]);
      })
    );

  }

  getPlayer() {
    return this.playerListSubject;
  }

  addPlayer(player: any) {
    this.playerListSubject.next(player);
  }
}
