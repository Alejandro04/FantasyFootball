import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs'; // Importa 'of' para simular observables
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

  it('should create the app', () => {
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
  
});
