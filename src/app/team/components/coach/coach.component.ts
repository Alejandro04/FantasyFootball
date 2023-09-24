import { Component, OnDestroy, OnInit } from "@angular/core";
import { Coach } from "../../interfaces/coach.interface";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { TeamService } from "../../services/team.service";

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit, OnDestroy {
  coachs: Coach[] = [];
  showCoachs: boolean = false;
  showCoach: boolean = false;
  coachNotFound: boolean = false;
  coachInput: string = "";
  savedCoach: boolean = false;
  coachSubscription: Subscription = new Subscription;
  private searchCoachSubject = new Subject<string>();
  msgValidationCoach: boolean = false;
  coach!: Coach;

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.searchCoachDebounce();
    this.getCoach();
  }

  searchCoachDebounce() {
    this.coachSubscription = this.searchCoachSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(criteria => this.teamService.searchCoach(criteria))
      )
      .subscribe(coachs => {
        if (coachs.length > 0) {
          this.coachs = coachs;
          this.coachNotFound = false;
          return
        }

        this.coachNotFound = true;
      });
  }

  getCoach(){
    const localStorageData = localStorage.getItem("coach");
    if(localStorageData){
      this.savedCoach = true;
      const coach:Coach = JSON.parse(localStorageData);
      this.selectCoach(coach)
    }
  }

  searchCoach(event: Event) {
    this.showCoachs = true;
    const element = event.target as HTMLSelectElement;
    const criteria = element.value;
    this.savedCoach = false;
    this.searchCoachSubject.next(criteria);
  }

  selectCoach(coach: Coach) {
    this.showCoachs = false;
    this.showCoach = true;
    this.coach = coach;
  }

  saveCoach(coach: Coach) {
    const localStorageData = localStorage.getItem("coach")
    if (localStorageData) {
      this.msgValidationCoach = true;
      return
    }

    this.savedCoach = true;
    localStorage.setItem("coach", JSON.stringify(coach))
  }

  deleteCoach() {
    this.msgValidationCoach = false;
    this.showCoach = false;
    this.coachInput = "";
    localStorage.removeItem('coach')
  }

  ngOnDestroy() {
    this.coachSubscription.unsubscribe();
   }
}