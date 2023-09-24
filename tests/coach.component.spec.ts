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

  // it('should have less than three players with position "Attackers"', () => {
  //   fixture.detectChanges();

  //   const fakePlayer = [
  //     {
  //       "id": 1100,
  //       "name": "E. Haaland",
  //       "photo": "https://media-4.api-sports.io/football/players/1100.png",
  //       "age": 23,
  //       "nationality": "Norway",
  //       "position": "Midfielder",
  //       "teamID": 50,
  //       "teamName": "Manchester City"
  //     },
  //     {
  //       "id": 30412,
  //       "name": "Kevin Mirallas",
  //       "photo": "https://media-4.api-sports.io/football/players/30412.png",
  //       "age": 36,
  //       "nationality": "Belgium",
  //       "position": "Midfielder",
  //       "teamID": 45,
  //       "teamName": "Everton"
  //     },
  //     {
  //       "id": 1485,
  //       "name": "Bruno Fernandes",
  //       "photo": "https://media-4.api-sports.io/football/players/1485.png",
  //       "age": 29,
  //       "nationality": "Portugal",
  //       "position": "Midfielder",
  //       "teamID": 33,
  //       "teamName": "Manchester United"
  //     },
  //     {
  //       "id": 874,
  //       "name": "Cristiano Ronaldo",
  //       "photo": "https://media-4.api-sports.io/football/players/874.png",
  //       "age": 38,
  //       "nationality": "Portugal",
  //       "position": "Attacker",
  //       "teamID": 33,
  //       "teamName": "Manchester United"
  //     },
  //     {
  //       "id": 41642,
  //       "name": "José Eduardo Rosa Vale de Castro",
  //       "photo": "https://media-4.api-sports.io/football/players/41642.png",
  //       "age": 39,
  //       "nationality": "Portugal",
  //       "position": "Defender",
  //       "teamID": 728,
  //       "teamName": "Rayo Vallecano"
  //     },
  //     {
  //       "id": 1853,
  //       "name": "Bruno Jordão",
  //       "photo": "https://media-4.api-sports.io/football/players/1853.png",
  //       "age": 25,
  //       "nationality": "Portugal",
  //       "position": "Midfielder",
  //       "teamID": 39,
  //       "teamName": "Wolves"
  //     },
  //     {
  //       "id": 747,
  //       "name": "Casemiro",
  //       "photo": "https://media-4.api-sports.io/football/players/747.png",
  //       "age": 31,
  //       "nationality": "Brazil",
  //       "position": "Defender",
  //       "teamID": 541,
  //       "teamName": "Real Madrid"
  //     },
  //     {
  //       "id": 7,
  //       "name": "Casemiro",
  //       "photo": "https://media-4.api-sports.io/football/players/747.png",
  //       "age": 31,
  //       "nationality": "Brazil",
  //       "position": "Defender",
  //       "teamID": 541,
  //       "teamName": "Real Madrid"
  //     },
  //     {
  //       "id": 17,
  //       "name": "Casemiro",
  //       "photo": "https://media-4.api-sports.io/football/players/747.png",
  //       "age": 31,
  //       "nationality": "Brazil",
  //       "position": "Attacker",
  //       "teamID": 541,
  //       "teamName": "Real Madrid"
  //     },
  //     {
  //       "id": 120,
  //       "name": "Casemiro",
  //       "photo": "https://media-4.api-sports.io/football/players/747.png",
  //       "age": 31,
  //       "nationality": "Brazil",
  //       "position": "Defender",
  //       "teamID": 541,
  //       "teamName": "Real Madrid"
  //     }
  //   ]
  //   const attackers:Player[] = fakePlayer.filter((item:Player) => {
  //     return item.position === "Attacker"
  //   })

  //   expect(attackers.length).toBeLessThan(3);
  // });

});
