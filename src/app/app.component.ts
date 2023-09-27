import { Component, OnInit } from '@angular/core';
import { TeamV2Service } from './teamv2.service';
import { Team } from './country.interface';
import { Player } from './team.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  countries: Team[] = [];
  players: Player[] = [];
  coach: any;
  goalKeepers: any[] = []

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
    if (player.position === 'Goalkeeper' && this.goalKeepers.length <= 3) {

      const savedPlayer = this.goalKeepers.find((item) => {
        return item.id === player.id
      })

      if (savedPlayer) return

      this.goalKeepers = [
        ...this.goalKeepers,
        {
          id: player.id,
          name: player.name,
          photo: player.photo,
          position: player.position
        }
      ]
    }
  }

  deletePlayer(player:any){
    if(player.position === 'Goalkeeper'){
      this.goalKeepers = this.goalKeepers.filter((item) => {
        return item.id !== player.id;
      })
    }
  }
}
