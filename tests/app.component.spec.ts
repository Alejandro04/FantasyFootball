import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../src/app/app.component';
import { TeamService } from '../src/app/team/services/team.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientModule],
      providers: [TeamService],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    teamService = TestBed.inject(TeamService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // it('should loop through players when team is not empty', () => {
  //   const player: Player = {
  //     id: 1,
  //     name: 'Test Player',
  //     photo: 'test.jpg',
  //     age: 25,
  //     nationality: 'Test Nationality',
  //     position: 'Test Position',
  //     teamID: 86
  //   };

  //   component.team = [player];
  //   fixture.detectChanges();

  //   const playerElements = fixture.nativeElement.querySelectorAll('.playerName');
  //   expect(playerElements.length).toBe(1); // Verifica que se muestre el jugador
  //   expect(playerElements[0].textContent).toContain('Test Player'); // Verifica el nombre del jugador
  // });
});
