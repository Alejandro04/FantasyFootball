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
});
