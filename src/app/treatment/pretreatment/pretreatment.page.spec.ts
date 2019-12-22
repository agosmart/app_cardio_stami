import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PretreatmentPage } from './pretreatment.page';

describe('PretreatmentPage', () => {
  let component: PretreatmentPage;
  let fixture: ComponentFixture<PretreatmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretreatmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PretreatmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
