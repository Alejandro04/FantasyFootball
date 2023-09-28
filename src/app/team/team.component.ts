import { Component, OnInit } from '@angular/core';
import { TeamV2Service } from './teamv2.service';
import { Team } from './country.interface';
import { Player } from './team.interface';
import { Position } from './enums';
import { CouchResponse } from './coach.interface';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  countries: Team[] = [];
  players: any[] = [];
  coach: CouchResponse | any;
  goalKeepers: Player[] = [];
  defenders: Player[] = [];
  attackers: Player[] = [];
  midfielders: Player[] = [];
  totalPlayers: number = 0;
  coachSelected: CouchResponse | any;
  hasValidationMsg: boolean = false;
  hasTeamSaved: boolean = false;
  hasDataInLs: boolean = false;

  constructor(
    private teamService: TeamV2Service
  ) { }

  ngOnInit() {
    this.getCountries();
    this.getSavedTeam();
  }

  getCountries() {
    this.teamService.getCountries().subscribe((countries) => {
      this.countries = countries;
    })
  }

  selectCountry(country:any){
    this.getTeam(country);
    this.getCoach(country)
  }

  getTeam(country: any) {
    this.teamService.getTeam(country.id).subscribe((players) => {
      this.players = players;
    })
  }

  getCoach(country:any) {
    this.teamService.getCoach(country.id).subscribe((coach) => {
      this.coach = coach[0];
    })
  }


  savePlayer(player: Player) {
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

  private savePlayerByPosition(player: Player, listElements: unknown[], limit: number) {
    const savedPlayer = listElements.find((item: any) => item.id === player.id);

    if (savedPlayer || listElements.length >= limit) return;

    listElements.push({
      id: player.id,
      name: player.name,
      photo: player.photo,
      position: player.position
    });

    this.calculateTotalPlayers()
  }

  deletePlayer(player: Player) {
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

  private deletePlayerByPosition(player: Player, listElements: unknown[]) {
    const playerIndex = listElements.findIndex((item: any) => item.id === player.id);

    if (playerIndex !== -1) {
      listElements.splice(playerIndex, 1);
    }

    this.calculateTotalPlayers();
  }

  private calculateTotalPlayers() {
    this.totalPlayers = this.goalKeepers.length + this.defenders.length + this.midfielders.length + this.attackers.length;
  }

  saveCoach(coach: CouchResponse) {
    this.coachSelected = {
      name: coach.name,
      photo: coach.photo
    }
  }

  deleteCoach() {
    this.coachSelected = "";
  }

  saveTeam() {
    console.log("attackers", this.attackers)
    if (this.goalKeepers.length === 2 &&
      this.defenders.length === 4 &&
      this.midfielders.length === 4 &&
      this.attackers.length === 2 &&
      this.coachSelected) {
      localStorage.clear();
      localStorage.setItem('goalkeepers', JSON.stringify(this.goalKeepers));
      localStorage.setItem('defenders', JSON.stringify(this.defenders))
      localStorage.setItem('midfielders', JSON.stringify(this.midfielders));
      localStorage.setItem('attackers', JSON.stringify(this.attackers))
      localStorage.setItem('coachSelected', JSON.stringify(this.coachSelected));
      this.hasTeamSaved = true;
      this.hasValidationMsg = false;
      return
    }

    this.hasTeamSaved = false;
    this.hasValidationMsg = true;
  }

  getSavedTeam(){
    const goalKeepers = localStorage.getItem('goalkeepers');
    if(goalKeepers) {
      this.hasDataInLs = true;
      this.goalKeepers = JSON.parse(goalKeepers);
    }

    const defenders = localStorage.getItem('defenders');
    if(defenders) {
      this.defenders = JSON.parse(defenders);
    }

    const midfielders = localStorage.getItem('midfielders');
    if(midfielders) {
      this.midfielders = JSON.parse(midfielders);
    }

    const attackers = localStorage.getItem('attackers');
    if(attackers) {
      this.attackers = JSON.parse(attackers);
    }

    const coach = localStorage.getItem('coachSelected');
    if(coach) {
      this.coachSelected = JSON.parse(coach);
    }
  }
}