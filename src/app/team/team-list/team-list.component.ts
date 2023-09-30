import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamV2Service } from "../teamv2.service";
import { CountryResponse, Team } from "../country.interface";
import { CouchResponse } from "../coach.interface";
import { Player } from "../player.interface";

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit, OnDestroy {
  countries: Team[] = [];
  players: any[] = [];
  coach: CouchResponse | any;

  constructor(
    private teamService: TeamV2Service
  ) { }

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.teamService.getCountries().subscribe((countries) => {
      this.countries = countries;
    })
  }

  selectCountry(country: any) {
    this.getTeam(country);
    this.getCoach(country)
  }


  getTeam(country: any) {
    this.teamService.getTeam(country.id).subscribe((players) => {
      this.players = players;
    })
  }

  getCoach(country: any) {
    this.teamService.getCoach(country.id).subscribe((coach) => {
      this.coach = coach[0];
    })
  }

  savePlayer(player:Player){
    this.teamService.sendPlayer(player);
  }

  saveCoach(coach:CouchResponse){
    this.teamService.sendCoach(coach);
  }


  ngOnDestroy() { }
}