import { Component, OnInit } from '@angular/core';
import { TeamService } from './team/services/team.service';
import { Player } from './team/interfaces/player.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fantasyFootball';
  team: any[] = [];
  player!: Player;
  completeTeam: boolean = false;

  constructor(
    private teamService: TeamService
  ){}

  ngOnInit(){
    this.getPlayer();
    this.getTeam();
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

    localStorage.clear();
    localStorage.setItem('team', JSON.stringify(this.team))
    this.completeTeam = false;
  }

  clearTeam(){
    localStorage.clear();
    this.team = [];
    this.completeTeam = false;
  }
}
