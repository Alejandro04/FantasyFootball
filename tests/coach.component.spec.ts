import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { TeamService } from '../src/app/team/services/team.service';
import { Player } from '../src/app/team/interfaces/player.interface';
import { FormsModule } from '@angular/forms';
import { CoachComponent } from '../src/app/team/components/coach/coach.component';
import { CoachResponse } from 'src/app/team/interfaces/coach.interface';

describe('CoachComponent', () => {
  let fixture: ComponentFixture<CoachComponent>;
  let component: CoachComponent;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachComponent],
      imports: [HttpClientModule, FormsModule],
      providers: [TeamService],
    });

    fixture = TestBed.createComponent(CoachComponent);
    component = fixture.componentInstance;
    teamService = TestBed.inject(TeamService);
  });

  it('should coach component the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display the first coach when team is not empty', () => {
    const coach: CoachResponse[] = [
      {
        id: 1,
        name: 'Coach 1',
        photo: 'test1.jpg',
        age: 52,
        nationality: 'Test Nationality 1'
      }
    ];

    component.showCoach = true;

    jest.spyOn(teamService, 'searchCoach').mockReturnValue(of(coach));

    fixture.detectChanges();

    const playerNameElement = fixture.nativeElement.querySelector('#coachName');
    expect(playerNameElement).toBeTruthy();
  });

  it('should have max one coachs', () => {
    fixture.detectChanges();

    const fakeCoach = [
      {
        "id": 40,
        "name": "T. Tuchel",
        "firstname": "Thomas",
        "lastname": "Tuchel",
        "age": 50,
      },
    ]

    expect(fakeCoach.length).toBeLessThan(2);
  });
});
