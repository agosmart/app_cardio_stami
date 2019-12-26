import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterventionPage } from './intervention.page';

describe('InterventionPage', () => {
  let component: InterventionPage;
  let fixture: ComponentFixture<InterventionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
