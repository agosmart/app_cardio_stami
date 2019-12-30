import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombAbsolutPage } from './thromb-absolut.page';

describe('ThrombAbsolutPage', () => {
  let component: ThrombAbsolutPage;
  let fixture: ComponentFixture<ThrombAbsolutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombAbsolutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombAbsolutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
