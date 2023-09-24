import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { TeamService } from '../src/app/team/services/team.service';
import { Player } from '../src/app/team/interfaces/player.interface';
import { TeamComponent } from '../src/app/team/components/team.component';
import { FormsModule } from '@angular/forms';

describe('TeamComponent', () => {
  let fixture: ComponentFixture<TeamComponent>;
  let component: TeamComponent;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamComponent],
      imports: [HttpClientModule, FormsModule],
      providers: [TeamService],
    });

    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    teamService = TestBed.inject(TeamService);
  });

  it('should team component in the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display the first player when team is not empty', () => {
    const players: Player[] = [
      {
        id: 1,
        name: 'Test Player 1',
        photo: 'test1.jpg',
        age: 25,
        nationality: 'Test Nationality 1',
        position: 'Test Position 1',
        teamID: 86
      }
    ];

    component.showPlayer = true;

    // Espía el método 'searchPlayer' del servicio y devuelve un observable de jugadores
    jest.spyOn(teamService, 'searchPlayer').mockReturnValue(of(players));

    // Activa la detección de cambios
    fixture.detectChanges();

    const playerNameElement = fixture.nativeElement.querySelector('#playerName');
    expect(playerNameElement).toBeTruthy();
  });

  it('should have less than three players with position "Attackers"', () => {
    fixture.detectChanges();

    const fakePlayer = [
      {
        "id": 1100,
        "name": "E. Haaland",
        "photo": "https://media-4.api-sports.io/football/players/1100.png",
        "age": 23,
        "nationality": "Norway",
        "position": "Midfielder",
        "teamID": 50,
        "teamName": "Manchester City"
      },
      {
        "id": 30412,
        "name": "Kevin Mirallas",
        "photo": "https://media-4.api-sports.io/football/players/30412.png",
        "age": 36,
        "nationality": "Belgium",
        "position": "Midfielder",
        "teamID": 45,
        "teamName": "Everton"
      },
      {
        "id": 1485,
        "name": "Bruno Fernandes",
        "photo": "https://media-4.api-sports.io/football/players/1485.png",
        "age": 29,
        "nationality": "Portugal",
        "position": "Midfielder",
        "teamID": 33,
        "teamName": "Manchester United"
      },
      {
        "id": 874,
        "name": "Cristiano Ronaldo",
        "photo": "https://media-4.api-sports.io/football/players/874.png",
        "age": 38,
        "nationality": "Portugal",
        "position": "Attacker",
        "teamID": 33,
        "teamName": "Manchester United"
      },
      {
        "id": 41642,
        "name": "José Eduardo Rosa Vale de Castro",
        "photo": "https://media-4.api-sports.io/football/players/41642.png",
        "age": 39,
        "nationality": "Portugal",
        "position": "Defender",
        "teamID": 728,
        "teamName": "Rayo Vallecano"
      },
      {
        "id": 1853,
        "name": "Bruno Jordão",
        "photo": "https://media-4.api-sports.io/football/players/1853.png",
        "age": 25,
        "nationality": "Portugal",
        "position": "Midfielder",
        "teamID": 39,
        "teamName": "Wolves"
      },
      {
        "id": 747,
        "name": "Casemiro",
        "photo": "https://media-4.api-sports.io/football/players/747.png",
        "age": 31,
        "nationality": "Brazil",
        "position": "Defender",
        "teamID": 541,
        "teamName": "Real Madrid"
      },
      {
        "id": 7,
        "name": "Casemiro",
        "photo": "https://media-4.api-sports.io/football/players/747.png",
        "age": 31,
        "nationality": "Brazil",
        "position": "Defender",
        "teamID": 541,
        "teamName": "Real Madrid"
      },
      {
        "id": 17,
        "name": "Casemiro",
        "photo": "https://media-4.api-sports.io/football/players/747.png",
        "age": 31,
        "nationality": "Brazil",
        "position": "Attacker",
        "teamID": 541,
        "teamName": "Real Madrid"
      },
      {
        "id": 120,
        "name": "Casemiro",
        "photo": "https://media-4.api-sports.io/football/players/747.png",
        "age": 31,
        "nationality": "Brazil",
        "position": "Defender",
        "teamID": 541,
        "teamName": "Real Madrid"
      }
    ]
    const attackers:Player[] = fakePlayer.filter((item:Player) => {
      return item.position === "Attacker"
    })

    expect(attackers.length).toBeLessThan(3);
  });
});
