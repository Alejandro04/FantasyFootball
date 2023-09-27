import { Component, OnInit } from '@angular/core';
import { TeamV2Service } from './teamv2.service';
import { Team } from './country.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  countries: Team[] = [];

  constructor(
    private teamService: TeamV2Service
  ){}

  ngOnInit(){
    this.getCountries();
  }

  getCountries(){
    this.teamService.getCountries().subscribe((countries) => {
      this.countries = countries;
    })
  }
}
