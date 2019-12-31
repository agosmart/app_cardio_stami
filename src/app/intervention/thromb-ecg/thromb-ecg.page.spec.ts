import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombEcgPage } from './thromb-ecg.page';

describe('ThrombEcgPage', () => {
  let component: ThrombEcgPage;
  let fixture: ComponentFixture<ThrombEcgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombEcgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombEcgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
