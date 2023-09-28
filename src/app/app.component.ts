import { Component, OnInit } from '@angular/core';
import { TeamV2Service } from './teamv2.service';
import { Team } from './country.interface';
import { Player } from './team.interface';
import { Position } from './team/enums/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  countries: Team[] = [];
  players: Player[] = [];
  coach: any;
  goalKeepers: any[] = [];
  defenders: any[] = [];

  constructor(
    private teamService: TeamV2Service
  ) { }

  ngOnInit() {
    this.getCountries();
    this.getTeam();
    this.getCoach();
  }

  getCountries() {
    this.teamService.getCountries().subscribe((countries) => {
      this.countries = countries;
    })
  }

  getTeam() {
    this.teamService.getTeam(1).subscribe((players) => {
      this.players = players;
    })
  }

  getCoach() {
    this.teamService.getCoach(1).subscribe((coach) => {
      this.coach = coach[0];
    })
  }


  savePlayer(player: any) {
    if (player.position === Position.Goalkeeper) {
      this.savePlayerByPosition(player, this.goalKeepers, 3);
    }
    if (player.position === Position.Defender) {
      this.savePlayerByPosition(player, this.defenders, 3);
    }
  }

  private savePlayerByPosition(player: any, listElements: any[], limit: number) {
    const savedPlayer = listElements.find((item) => item.id === player.id);

    if (savedPlayer || listElements.length >= limit) return;

    listElements.push({
      id: player.id,
      name: player.name,
      photo: player.photo,
      position: player.position,
    });
  }

  deletePlayer(player: any) {
    if (player.position === Position.Goalkeeper) {
      this.deletePlayerByPosition(player, this.goalKeepers);
    }
    if (player.position === Position.Defender) {
      this.deletePlayerByPosition(player, this.defenders);
    }
  }

  private deletePlayerByPosition(player: any, listElements: any[]) {
    const playerIndex = listElements.findIndex((item) => item.id === player.id);

    if (playerIndex !== -1) {
      listElements.splice(playerIndex, 1);
    }
  }
}
