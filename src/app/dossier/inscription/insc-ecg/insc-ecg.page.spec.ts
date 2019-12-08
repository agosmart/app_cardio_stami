import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InscEcgPage } from './insc-ecg.page';

describe('InscEcgPage', () => {
  let component: InscEcgPage;
  let fixture: ComponentFixture<InscEcgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscEcgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InscEcgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
