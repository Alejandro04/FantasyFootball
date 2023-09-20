import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiLeagueResponse, League, LeagueResponse } from './league.interface';
import { PlayerParam } from './playerParams.interface';
import { ApiPlayerResponse, PlayerResponse } from './player.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private leagueApiUrl = "https://api-football-v1.p.rapidapi.com/v3/leagues";
  private playerApiUrl = "https://api-football-v1.p.rapidapi.com/v3/players";
  
  constructor(
    private http: HttpClient
  ) { }

  searchLeague(param: string): Observable<any[]> {
    return this.http.get<ApiLeagueResponse>(`${this.leagueApiUrl}?search=${param}`).pipe(
      map((apiresponse) => {
        return apiresponse.response.map((league) => {
          return {
            id: league.league.id,
            name: league.league.name,
            country: league.country.name
          }
        })
      })
    );
  }

  searchPlayer(params: PlayerParam): Observable<any[]> {
    const leagueID = params.leagueID;
    const player = params.player;

    return this.http.get<ApiPlayerResponse>(`${this.playerApiUrl}?league=${leagueID}&search=${player}`).pipe(
      map((apiresponse) => {
        return apiresponse.response.map((player) => {
          return {
            name: player.player.name,
            photo: player.player.photo
          }
        });
      })
    );
  }
}
