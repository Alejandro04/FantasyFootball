import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { LeagueResponse } from "./league.interface";
import { PlayerParam } from "./playerParams.interface";
import { PlayerResponse } from "./player.interface";

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
  })
export class TeamComponent implements OnInit, OnDestroy{
    private leagues: LeagueResponse[] = [];
    private players: PlayerResponse[] = [];

    constructor(
        private teamService: TeamService
    ){}

    ngOnInit(){
        this.getLeagues("")
        const params = {
            league: '61',
            player: 'neymar'
        }
        this.getPlayers(params)
    }

    ngOnDestroy(){}

    getLeagues(params: string){
        this.teamService.searchLeague(params).subscribe((leagues) => {
            this.leagues = leagues;
            console.log("leagues", this.leagues)
        })
    }

    getPlayers(params: PlayerParam){
        this.teamService.searchPlayer(params).subscribe((players) => {
            this.players = players;
            console.log("players", this.players)
        })
    }
}