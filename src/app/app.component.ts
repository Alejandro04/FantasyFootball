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

  constructor(
    private teamService: TeamV2Service
  ){}

  ngOnInit(){
    this.getCountries();
    this.getTeam();
    this.getCoach();
  }

  getCountries(){
    this.teamService.getCountries().subscribe((countries) => {
      this.countries = countries;
    })
  }

  getTeam(){
    this.teamService.getTeam(1).subscribe((players) => {
      this.players = players;
    })
  }

  getCoach(){
    this.teamService.getCoach(1).subscribe((coach) => {
      this.coach = coach[0];
    })
  }
}
