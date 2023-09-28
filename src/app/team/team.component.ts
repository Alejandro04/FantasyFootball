import { Component, OnInit } from '@angular/core';
import { TeamV2Service } from './teamv2.service';
import { Team } from './country.interface';
import { Player } from './team.interface';
import { Position } from './enums';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  countries: Team[] = [];
  players: Player[] = [];
  coach: any;
  goalKeepers: any[] = [];
  defenders: any[] = [];
  attackers: any[] = [];
  midfielders: any[] = [];
  totalPlayers: number = 0;
  coachSelected: any;

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
      this.savePlayerByPosition(player, this.goalKeepers, 2);
    }
    if (player.position === Position.Defender) {
      this.savePlayerByPosition(player, this.defenders, 4);
    }
    if (player.position === Position.Midfielder) {
      this.savePlayerByPosition(player, this.midfielders, 4);
    }
    if (player.position === Position.Attacker) {
      this.savePlayerByPosition(player, this.attackers, 2);
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

    this.calculateTotalPlayers()
  }

  deletePlayer(player: any) {
    if (player.position === Position.Goalkeeper) {
      this.deletePlayerByPosition(player, this.goalKeepers);
    }
    if (player.position === Position.Defender) {
      this.deletePlayerByPosition(player, this.defenders);
    }
    if (player.position === Position.Midfielder) {
      this.deletePlayerByPosition(player, this.midfielders);
    }
    if (player.position === Position.Attacker) {
      this.deletePlayerByPosition(player, this.attackers);
    }
  }

  private deletePlayerByPosition(player: any, listElements: any[]) {
    const playerIndex = listElements.findIndex((item) => item.id === player.id);

    if (playerIndex !== -1) {
      listElements.splice(playerIndex, 1);
    }

   this.calculateTotalPlayers();
  }

  private calculateTotalPlayers(){
    this.totalPlayers = this.goalKeepers.length + this.defenders.length + this.midfielders.length + this.attackers.length;
  }

  saveCoach(coach:any){
    this.coachSelected = {
      name: coach.name,
      photo: coach.photo
    }
  }

  deleteCoach(){
    this.coachSelected = "";
  }
}