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
  team: any;

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
   
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
    })
  }

  selectLeague(league: League) {
    this.selectedLeagueID = league.id;
  }

  savePlayer() {
    const localStorageData = localStorage.getItem('team');
    if (localStorageData) {
      const existingData = JSON.parse(localStorageData);
      const newData = { name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png' }; // Reemplaza esto con tus datos reales
      existingData.push(newData);
      localStorage.setItem('team', JSON.stringify(existingData));
    } else {
      const initialData = [{ name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png' }];
      localStorage.setItem('team', JSON.stringify(initialData));
    }
  }
}