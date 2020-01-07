import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombSosPage } from './thromb-sos.page';

describe('ThrombSosPage', () => {
  let component: ThrombSosPage;
  let fixture: ComponentFixture<ThrombSosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombSosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombSosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
