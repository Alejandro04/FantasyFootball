import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { League, LeagueResponse } from "./league.interface";
import { PlayerParam } from "./playerParams.interface";
import { Player, PlayerResponse } from "./player.interface";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  leagues: League[] = [];
  player: Player | undefined;
  selectedLeagueID: number = 0;
  selectedLeague: any;
  team: any;
  showLeagues: boolean = true;
  showSelectedLeague: boolean = false;
  showPlayer: boolean = false;
  savedPlayer: boolean = false;
  playerDataSubject = new Subject;
  leagueSubscription: Subscription = new Subscription;
  playerSubscription: Subscription = new Subscription;

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {}

  searchLeagues(event: Event) {
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;

    this.leagueSubscription = this.teamService.searchLeague(criteria).subscribe((leagues) => {
      this.leagues = leagues;
    })
  }

  searchPlayers(event: Event) {
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;

    const params = {
      player: criteria,
      leagueID: this.selectedLeagueID
    }

    this.playerSubscription = this.teamService.searchPlayer(params).subscribe((players) => {
      this.player = players[0];
      this.showPlayer = true;
    })
  }

  selectLeague(league: League) {
    this.selectedLeague = league;
    this.selectedLeagueID = league.id;
    this.showLeagues = false;
    this.showSelectedLeague = true;
  }

  savePlayer() {
    const localStorageData = localStorage.getItem('team');
    const newData = { id: 270, name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png', age: '33', nationality: 'Brazil', position: 'Atacante' };
    this.teamService.addPlayer(newData);

    if (localStorageData) {
      const existingData = JSON.parse(localStorageData);
      existingData.push(newData);
      localStorage.setItem('team', JSON.stringify(existingData));
    } else {
      localStorage.setItem('team', JSON.stringify([newData]));
    }

    this.savedPlayer = true;
  }

  cleanAllState(){
    this.showPlayer = false;
    this.savedPlayer = false;
    this.showSelectedLeague = false;
    this.selectedLeague = "";
    this.showLeagues = true;
  }

  ngOnDestroy() { 
    this.leagueSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }
}