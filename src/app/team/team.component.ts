import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { League, LeagueResponse } from "./league.interface";
import { PlayerParam } from "./playerParams.interface";
import { Player, PlayerResponse } from "./player.interface";

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

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    //this.savePlayer()
  }

  ngOnDestroy() { }

  searchLeagues(event: Event) {
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;

    this.teamService.searchLeague(criteria).subscribe((leagues) => {
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

    this.teamService.searchPlayer(params).subscribe((players) => {
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
    if (localStorageData) {
      console.log("con data")
      const existingData = JSON.parse(localStorageData);
      const newData = { name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png', age: '33', nationality: 'Brazil', position: 'Atacante' };
      existingData.push(newData);
      localStorage.setItem('team', JSON.stringify(existingData));
    } else {
      console.log("sin data")
      const initialData = [{ name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png', age: '33', nationality: 'Brazil', position: 'Atacante' }];
      localStorage.setItem('team', JSON.stringify(initialData));
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
}