import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fantasyFootball';
  team: any;
  
  ngOnInit(){
    this.getTeam()
  }

  getTeam(){
    const teamDataJSON = localStorage.getItem('team');
    if (teamDataJSON) {
      this.team = JSON.parse(teamDataJSON);
    }
  }
}
