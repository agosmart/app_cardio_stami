import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvoiCrPage } from './envoi-cr.page';

describe('EnvoiCrPage', () => {
  let component: EnvoiCrPage;
  let fixture: ComponentFixture<EnvoiCrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvoiCrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnvoiCrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
