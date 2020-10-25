import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PilotsPage } from './pilots.page';

describe('PilotsPage', () => {
  let component: PilotsPage;
  let fixture: ComponentFixture<PilotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PilotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
