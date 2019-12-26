import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombPage } from './thromb.page';

describe('ThrombPage', () => {
  let component: ThrombPage;
  let fixture: ComponentFixture<ThrombPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
