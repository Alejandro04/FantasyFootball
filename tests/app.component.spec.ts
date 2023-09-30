import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../src/app/app.component';
import { TeamV2Service } from '../src/app/team/teamv2.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let teamService: TeamV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientModule],
      providers: [TeamV2Service],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    teamService = TestBed.inject(TeamV2Service);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
