import { Component, OnInit } from '@angular/core';
import { TeamService } from './team/services/team.service';
import { Player } from './team/interfaces/player.interface';
import {NgFor, AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  title = 'fantasyFootball';
  team: any[] = [];
  player!: Player;
  completeTeam: boolean = false;

  countries: any[] = [
    {value: 'arg', viewValue: 'Argentina'},
    {value: 'bra', viewValue: 'Brasil'},
    {value: 'ven', viewValue: 'Venezuela'},
  ];

  constructor(
    private teamService: TeamService
  ){}

  ngOnInit(){
    this.getPlayer();
    this.getTeam();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getPlayer(){
    this.teamService.playerList$.subscribe((player) => {
      if(player){
        this.team = [ ...this.team, player ]
      }

      if(this.team.length === 16){
        this.completeTeam = true;
      }
    });
  }

  getTeam(){
    const teamDataJSON = localStorage.getItem('team');
    if (teamDataJSON) {
      this.team = JSON.parse(teamDataJSON);
    }
  }

  deletePlayer(player:Player){
    this.team = this.team.filter((item:Player) => {
      return item.id !== player.id
    })

    localStorage.removeItem('team')
    localStorage.setItem('team', JSON.stringify(this.team))
    this.completeTeam = false;
  }

  clearTeam(){
    localStorage.removeItem('team');
    this.team = [];
    this.completeTeam = false;
  }
}
