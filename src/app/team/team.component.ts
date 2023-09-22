import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { League, LeagueResponse } from "./league.interface";
import { PlayerParam } from "./playerParams.interface";
import { Player, PlayerResponse } from "./player.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  leagues: League[] = [];
  player: Player | undefined;
  selectedLeagueID: number = 0;
  selectedLeague: any;
  team: any;
  showLeagues: boolean = true;
  showSelectedLeague: boolean = false;
  showPlayer: boolean = false;
  savedPlayer: boolean = false;
  playerDataSubject = new Subject;
  leagueSubscription: Subscription = new Subscription;
  playerSubscription: Subscription = new Subscription;
  private searchLeaguesSubject = new Subject<string>();
  private searchPlayersSubject = new Subject<string>();

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.searchLeaguesDebounce();
    this.searchPlayersDebounce();
  }

  searchLeaguesDebounce(){
    this.leagueSubscription = this.searchLeaguesSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(), 
        switchMap(criteria => this.teamService.searchLeague(criteria))
      )
      .subscribe(leagues => {
        this.leagues = leagues;
      });
  }

  searchPlayersDebounce(){
    this.playerSubscription = this.searchPlayersSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(criteria => this.teamService.searchPlayer({ player: criteria, leagueID: this.selectedLeagueID })) // Realiza la búsqueda
      )
      .subscribe(players => {
        console.log(players[0])
        this.player = players[0];
        this.showPlayer = true;
      });
  }

  searchLeagues(event: Event) {
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;
    this.searchLeaguesSubject.next(criteria);
  }

  searchPlayers(event: Event) {
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;
    this.searchPlayersSubject.next(criteria);
  }

  selectLeague(league: League) {
    this.selectedLeague = league;
    this.selectedLeagueID = league.id;
    this.showLeagues = false;
    this.showSelectedLeague = true;
  }

  savePlayer() {
    const localStorageData = localStorage.getItem('team');
    const newData = { id: 270, name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png', age: '33', nationality: 'Brazil', position: 'Atacante', teamName: 'Paris', teamID: 46 };
    this.teamService.addPlayer(newData);

    if (localStorageData) {
      const existingData = JSON.parse(localStorageData);
      const getMaxPlayerForTeam = this.getMaxPlayerForTeam(existingData, newData.teamID);
      
      if(existingData.length > 16){
        console.log("máximo 16 players por equipo")
        return 
      }

      if(!getMaxPlayerForTeam.saveMorePlayers){
        console.log("Equipos full")
        console.log(getMaxPlayerForTeam.fullTeamsIDs)
        console.log("selecciona jugador de otro equipo")
        return
      }

      if(getMaxPlayerForTeam.saveMorePlayers && Array.isArray(existingData)){  
        existingData.push(newData);
        localStorage.setItem('team', JSON.stringify(existingData));
        this.savedPlayer = true;
        return
      }

    } else {
      localStorage.setItem('team', JSON.stringify([newData]));
      this.savedPlayer = true;
    }
  }

  getMaxPlayerForTeam(existingData:Player[], teamID:number){
    let teamsIDs:number[] = this.getTeamsID(existingData)
    const maxPlayerForTeam = 4;
    let fullTeamsIDs:any[] = [];
    let saveMorePlayers:boolean = true;

    const countByValue = teamsIDs.reduce((count:any, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});
    
    for (const value in countByValue) {
      if (countByValue.hasOwnProperty(value)) {
        if (countByValue[value] >= maxPlayerForTeam) {
          if(parseInt(value) === teamID){
            console.log(`El valor ${value} tiene ${maxPlayerForTeam} registros.`);
            fullTeamsIDs.push(value)
            saveMorePlayers = false;
          }
        }else{
          saveMorePlayers = true;
        }
      }
    }

    return {
      saveMorePlayers,
      fullTeamsIDs
    }
  }

  getTeamsID(existingData:Player[]){
    let teamsIDs:number[] = [];
    teamsIDs = existingData.map((item:Player) => item.teamID);

    return teamsIDs;
  }

  cleanAllState(){
    this.showPlayer = false;
    this.savedPlayer = false;
    this.showSelectedLeague = false;
    this.selectedLeague = "";
    this.showLeagues = true;
  }

  ngOnDestroy() { 
    this.leagueSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }
}