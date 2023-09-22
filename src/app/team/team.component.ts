import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { League } from "./league.interface";
import { Player } from "./player.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { TeamLimits, Position } from './enums';
import { playerActions } from './playerAction.interface'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  leagues: League[] = [];
  player!: Player;
  selectedLeagueID: number = 0;
  selectedLeague!: League;
  showLeagues: boolean = true;
  showSelectedLeague: boolean = false;
  showPlayer: boolean = false;
  savedPlayer: boolean = false;
  playerValidate: boolean = false;
  playerDataSubject = new Subject;
  msgValidation: string = "";
  msgPositionValidation: string = "";
  msgCountValidation: string = "";
  msgHasPlayer: string = "";
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

  searchLeaguesDebounce() {
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

  searchPlayersDebounce() {
    this.playerSubscription = this.searchPlayersSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(criteria => this.teamService.searchPlayer({ player: criteria, leagueID: this.selectedLeagueID })) // Realiza la búsqueda
      )
      .subscribe(players => {
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
    const existingData = JSON.parse(localStorageData ? localStorageData : "");
    const hasPlayer = existingData.find((player:Player) => player.id === this.player.id);
    let newData = this.player;

    if (existingData && !hasPlayer) {
      console.log("no tenemos el jugador, guardando")
      this.teamService.addPlayer(newData);
      const getMaxPlayerForTeam = this.getMaxPlayerForTeam(existingData, newData.teamID, newData.position);

      if (existingData.length > 16) {
        this.msgValidation = "máximo 16 players por equipo"
        return
      }

      if (!getMaxPlayerForTeam.saveMoreIDPlayers ||
        !getMaxPlayerForTeam.saveMoreAttacker ||
        !getMaxPlayerForTeam.saveMoreDefenders ||
        !getMaxPlayerForTeam.saveMoreGoalkeeper ||
        !getMaxPlayerForTeam.saveMoreMidfielder) {
        this.msgValidation = "No puede guardar este jugador"
        this.playerValidate = true;
        return
      }

      if (Array.isArray(existingData)) {
        existingData.push(newData);
        localStorage.setItem('team', JSON.stringify(existingData));
        this.savedPlayer = true;
        return
      }

    } else {
      if(hasPlayer){
        this.playerValidate = true;
        this.msgHasPlayer = "No podemos fichar dos veces al mismo jugador";
        return
      }

      localStorage.setItem('team', JSON.stringify([newData]));
      this.savedPlayer = true;
    }
  }
  

  getMaxPlayerForTeam(existingData: Player[], teamID: number, position: string) {
    let teamsIDs: number[] = this.getTeamsID(existingData)
    let positions: string[] = this.getTeamPositions(existingData);
    let fullTeamsIDs: any[] = [];
    let fullTeamPositions: any[] = [];
    

    const countTeamIDs = teamsIDs.reduce((count: any, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});

    const teamPositions = positions.reduce((count: any, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});

    for (const value in countTeamIDs) {
      if (countTeamIDs.hasOwnProperty(value)) {
        if (countTeamIDs[value] >= TeamLimits.maxPlayerForTeam) {
          if (parseInt(value) === teamID) {
            this.msgCountValidation = "No puede guardar más jugadores de este equipo"
            fullTeamsIDs.push(value)
            playerActions.saveMoreIDPlayers = false;
          }else{
            playerActions.saveMoreIDPlayers = true;
          }
        } 
      }
    }

    if (position === Position.Defender) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Defender] >= TeamLimits.maxDefendersForTeam &&
            value === position) {
            this.msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreDefenders = false;
          }else{
            playerActions.saveMoreDefenders = true;
          }
        }
      }
    }

    if (position === Position.Midfielder) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Midfielder] >= TeamLimits.maxMidfieldersForTeam &&
            value === position) {
            this.msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreMidfielder = false;
          }else{
            playerActions.saveMoreMidfielder = true;
          }
        }
      }
    }

    if (position === Position.Goalkeeper) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Goalkeeper] >= TeamLimits.maxGoalkeepersForTeam &&
            value === position) {
            this.msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreGoalkeeper = false;
          }else{
            playerActions.saveMoreGoalkeeper = true;
          }
        }
      }
    }

    if (position === Position.Attacker) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Attacker] >= TeamLimits.maxAttackersForTeam) {
            this.msgPositionValidation = `No puede guardar más ${value}`
            fullTeamPositions.push(value)
            playerActions.saveMoreAttacker = false;
          }else{
            playerActions.saveMoreGoalkeeper = true;
          }
        }
      }
    }

    const saveMoreAttacker = playerActions.saveMoreAttacker;
    const saveMoreDefenders = playerActions.saveMoreDefenders;
    const saveMoreMidfielder = playerActions.saveMoreMidfielder;
    const saveMoreGoalkeeper = playerActions.saveMoreGoalkeeper;
    const saveMoreIDPlayers = playerActions.saveMoreIDPlayers;
    
    return {
      saveMoreIDPlayers,
      fullTeamsIDs,
      saveMoreDefenders,
      saveMoreMidfielder,
      saveMoreGoalkeeper,
      saveMoreAttacker,
      fullTeamPositions
    }
  }

  getTeamsID(existingData: Player[]) {
    let teamsIDs: number[] = [];
    teamsIDs = existingData.map((item: Player) => item.teamID);

    return teamsIDs;
  }

  getTeamPositions(existingData: Player[]) {
    let positions: string[] = [];
    positions = existingData.map((item: Player) => item.position);

    return positions;
  }

  cleanAllState() {
    this.showPlayer = false;
    this.savedPlayer = false;
    this.showSelectedLeague = false;
    this.selectedLeague = {} as League;
    this.showLeagues = true;
    this.playerValidate = false;
    this.msgPositionValidation = "";
    this.msgCountValidation = "";
  }

  ngOnDestroy() {
    this.leagueSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }
}