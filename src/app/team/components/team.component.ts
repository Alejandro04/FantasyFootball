import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";
import { League } from "../interfaces/league.interface";
import { Player } from "../interfaces/player.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { SpinnerService } from '../services/spinnerService';
import { UtilSavePlayer } from "../utils/savePlayer.util";
import { Coach } from "../interfaces/coach.interface";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends UtilSavePlayer implements OnInit, OnDestroy {
  leagues: League[] = [];
  coachs: Coach[] = [];
  player!: Player;
  selectedLeagueID: number = 0;
  selectedLeague!: League;
  showLeagues: boolean = true;
  showSelectedLeague: boolean = false;
  showPlayer: boolean = false;
  showCoachs: boolean = false;
  showCoach: boolean = false;
  playerDataSubject = new Subject;
  leagueInput: string = "";
  msgCompleteTeam: string = "";
  playerNotFound: boolean = false;
  leagueNotFound: boolean = false;
  coachNotFound: boolean = false;
  playerTab: boolean = true;
  coachTab: boolean = false;
  msgValidationCoach: boolean = false;
  coachInput: string = "";
  savedCoach: boolean = false;
  coachTabName: string = "Buscar coach"
  leagueSubscription: Subscription = new Subscription;
  playerSubscription: Subscription = new Subscription;
  coachSubscription: Subscription = new Subscription;
  private searchLeaguesSubject = new Subject<string>();
  private searchPlayersSubject = new Subject<string>();
  private searchCoachSubject = new Subject<string>();

  coach:any;

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
    this.searchCoachDebounce();
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

  searchCoachDebounce() {
    this.coachSubscription = this.searchCoachSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(criteria => this.teamService.searchCoach(criteria))
      )
      .subscribe(coachs => {
        if(coachs.length > 0){
          this.coachs = coachs;
          this.coachNotFound = false;
          return
        }

        this.coachNotFound = true;
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

  searchCoach(event: Event){
    this.showCoachs = true;
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;
    this.savedCoach = false;
    this.searchCoachSubject.next(criteria);
  }

  selectLeague(league: League) {
    this.selectedLeague = league;
    this.selectedLeagueID = league.id;
    this.showLeagues = false;
    this.showSelectedLeague = true;
  }

  selectCoach(coach: Coach){
    this.showCoachs = false;
    this.showCoach = true;
    this.coach = coach;
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

  saveCoach(coach: Coach){
    const localStorageData = localStorage.getItem("coach")
    if(localStorageData) {
      this.msgValidationCoach = true;
      return
    }

    this.savedCoach = true;
    this.coachTabName = "Ver coach"
    localStorage.setItem("coach", JSON.stringify(coach))
  }

  deleteCoach(){
    this.msgValidationCoach = false;
    this.showCoach = false;
    this.coachInput = "";
    this.coachTabName = "Buscar coach"
    localStorage.removeItem('coach')
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