import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TreatmentEngioPage } from './treatment-engio.page';

describe('TreatmentEngioPage', () => {
  let component: TreatmentEngioPage;
  let fixture: ComponentFixture<TreatmentEngioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentEngioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentEngioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
