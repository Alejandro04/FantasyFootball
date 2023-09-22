import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "./team.service";
import { League, LeagueResponse } from "./league.interface";
import { PlayerParam } from "./playerParams.interface";
import { Player, PlayerResponse } from "./player.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";

enum TeamLimits {
  maxPlayerForTeam = 4,
  maxAttackersForTeam = 2,
  maxDefendersForTeam = 4,
  maxMidfieldersForTeam = 4,
  maxGoalkeepersForTeam = 2,
}

enum Position {
  Defender = "Defender",
  Attacker = "Attacker",
  Midfielder = "Midfielder",
  Goalkeeper = "Goalkeeper", 
}

interface PlayerActions {
  saveMoreIDPlayers: boolean;
  saveMoreDefenders: boolean;
  saveMoreMidfielder: boolean;
  saveMoreGoalkeeper: boolean;
  saveMoreAttacker: boolean;
}

const playerActions: PlayerActions = {
  saveMoreIDPlayers: true,
  saveMoreDefenders: true,
  saveMoreMidfielder: true,
  saveMoreGoalkeeper: true,
  saveMoreAttacker: true,
};

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
    const newData = { id: 270, name: 'neymar', photo: 'https://media.api-sports.io/football/players/276.png', age: '33', nationality: 'Brazil', position: 'Midfielder', teamName: 'Paris', teamID: 1 };
    this.teamService.addPlayer(newData);

    if (localStorageData) {
      const existingData = JSON.parse(localStorageData);
      const getMaxPlayerForTeam = this.getMaxPlayerForTeam(existingData, newData.teamID, newData.position);

      if (existingData.length > 16) {
        console.log("máximo 16 players por equipo")
        return
      }

      if (!getMaxPlayerForTeam.saveMoreIDPlayers ||
        !getMaxPlayerForTeam.saveMoreAttacker ||
        !getMaxPlayerForTeam.saveMoreDefenders ||
        !getMaxPlayerForTeam.saveMoreGoalkeeper ||
        !getMaxPlayerForTeam.saveMoreMidfielder) {
        console.log("No puede guardar este jugador")
        return
      }

      if (Array.isArray(existingData)) {
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
            console.log(`No puede guardar más jugadores de este equipo`)
            fullTeamsIDs.push(value)
            playerActions.saveMoreIDPlayers = false;
          }
        } else {
          playerActions.saveMoreIDPlayers = true;
        }
      }
    }

    if (position === Position.Defender) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Defender] >= TeamLimits.maxDefendersForTeam &&
            value === position) {
            console.log(`No puede guardar más ${value}`)
            fullTeamPositions.push(value)
            playerActions.saveMoreDefenders = false;
          }
        }
      }
    }

    if (position === Position.Midfielder) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Midfielder] >= TeamLimits.maxMidfieldersForTeam &&
            value === position) {
            console.log(`No puede guardar más ${value}`)
            fullTeamPositions.push(value)
            playerActions.saveMoreMidfielder = false;
          }
        }
      }
    }

    if (position === Position.Goalkeeper) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Goalkeeper] >= TeamLimits.maxGoalkeepersForTeam &&
            value === position) {
            console.log(`No puede guardar más ${value}`)
            fullTeamPositions.push(value)
            playerActions.saveMoreGoalkeeper = false;
          }
        }
      }
    }

    if (position === Position.Attacker) {
      for (const value in teamPositions) {
        if (teamPositions.hasOwnProperty(value)) {
          if (teamPositions[Position.Attacker] >= TeamLimits.maxAttackersForTeam) {
            console.log(`No puede guardar más ${value}`)
            fullTeamPositions.push(value)
            playerActions.saveMoreAttacker = false;
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
  }

  ngOnDestroy() {
    this.leagueSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }
}