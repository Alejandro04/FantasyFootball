import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TeamV2Service } from '../src/app/team/teamv2.service';
import { TeamListComponent } from '../src/app/team/team-list/team-list.component';
import { FormsModule } from '@angular/forms';

describe('TeamComponent', () => {
  let fixture: ComponentFixture<TeamListComponent>;
  let component: TeamListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamListComponent],
      imports: [HttpClientModule, FormsModule, HttpClientTestingModule],
      providers: [TeamV2Service],
    });

    fixture = TestBed.createComponent(TeamListComponent);
    component = fixture.componentInstance;
  });

  it('should team component in the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch countries on ngOnInit', () => {
    const mockCountries = [{
      "id": 1,
      "name": "Belgium",
      "code": "BEL",
      "country": "Belgium",
      "founded": 1895,
      "national": true,
      "logo": "https://media-4.api-sports.io/football/teams/1.png"
    }]
    const service = TestBed.inject(TeamV2Service);
    jest.spyOn(service, 'getCountries').mockReturnValue(of(mockCountries));
    component.ngOnInit();
    expect(component.countries.length).toBe(mockCountries.length);
    expect(component.countries[0].name).toBe(mockCountries[0].name);
  });

  it('should fetch coach on selectCountry', () => {
    const mockCoach = {
      id: 1,
      name: 'Coach 1',
      photo: 'coach1.png'
    };
  
    const service = TestBed.inject(TeamV2Service);
    jest.spyOn(service, 'getCoach').mockReturnValue(of([mockCoach]));
  
    const mockCountry = {
      id: 1,
      name: 'Country 1',
      logo: 'logo1.png'
    };
    component.selectCountry(mockCountry);
    expect(service.getCoach).toHaveBeenCalledWith(mockCountry.id);
    expect(component.coach).toEqual(mockCoach);
  });
  
  
});
