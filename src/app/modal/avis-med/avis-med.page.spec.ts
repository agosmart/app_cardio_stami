import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvisMedPage } from './avis-med.page';

describe('AvisMedPage', () => {
  let component: AvisMedPage;
  let fixture: ComponentFixture<AvisMedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisMedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisMedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
