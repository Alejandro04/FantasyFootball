import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiLeagueResponse, LeagueResponse } from './league.interface';
import { PlayerParam } from './playerParams.interface';
import { ApiPlayerResponse, PlayerResponse } from './player.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private http: HttpClient
  ) { }

  searchLeague(param: string): Observable<LeagueResponse[]> {
    return this.http.get<ApiLeagueResponse>('./assets/league.json').pipe(
      map((apiresponse) => {
        return apiresponse.response;
      })
    );
  }

  searchPlayer(params: PlayerParam): Observable<PlayerResponse[]> {
    const league = params.league;
    const player = params.player;

    // TODO: Cambia la URL con los parámetros adecuados
    return this.http.get<ApiPlayerResponse>('./assets/player.json').pipe(
      map((apiresponse) => {
        return apiresponse.response;
      })
    );
  }
}
