import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";
import { League } from "../interfaces/league.interface";
import { Player } from "../interfaces/player.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { SpinnerService } from '../services/spinnerService';
import { UtilSavePlayer } from "../utils/savePlayer.util";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends UtilSavePlayer implements OnInit, OnDestroy {
  leagues: League[] = [];
  player: Player | undefined;
  selectedLeagueID: number = 0;
  selectedLeague!: League;
  showLeagues: boolean = true;
  showSelectedLeague: boolean = false;
  showPlayer: boolean = false;
  playerDataSubject = new Subject;
  leagueInput: string = "";
  msgCompleteTeam: string = "";
  playerNotFound: boolean = false;
  leagueNotFound: boolean = false;
  playerTab: boolean = true;
  coachTab: boolean = false;
  leagueSubscription: Subscription = new Subscription;
  playerSubscription: Subscription = new Subscription;
  private searchLeaguesSubject = new Subject<string>();
  private searchPlayersSubject = new Subject<string>();

  constructor(
    public spinnerService: SpinnerService ,
    teamService: TeamService
  ) {
    super(teamService);
    this.teamService = teamService;
  }
 
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
        if(leagues.length > 0){
          this.leagues = leagues;
          this.leagueNotFound = false;
        }else{
          this.leagueNotFound = true;
        }
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
        if(players[0]){
          this.player = players[0];
          this.playerNotFound = false;
          this.showPlayer = true;
        }else{
          this.playerNotFound = true;
        }
      });
  }

  searchLeagues(event: Event) {
    this.showLeagues = true;
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;
    this.searchLeaguesSubject.next(criteria);;
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

  showTab(option: string){
    if(option === 'player'){
      this.playerTab = true;
      this.coachTab = false;
      return
    }

    this.playerTab = false;
    this.coachTab = true;
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
    this.showLeagues = false;
    this.leagues = [];
    this.leagueInput = "";
    this.leagueNotFound = false;

    //el ultimo estado de un jugador cuando se valida
    // se debe actualizar cuando quiero fichar otro jugador
    // o en su defecto volver a todos con el estado original (true)
    // para que los sig jugadores puedan guardar
    this.teamService.resetValidations();
  }

  cleanPlayerState(){
    this.playerNotFound = false;
    this.playerValidate = false;
  }

  ngOnDestroy() {
    this.leagueSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }
}