import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfficePage } from './office.page';

describe('OfficePage', () => {
  let component: OfficePage;
  let fixture: ComponentFixture<OfficePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
