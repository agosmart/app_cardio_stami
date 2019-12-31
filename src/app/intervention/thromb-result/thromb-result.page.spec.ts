import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombResultPage } from './thromb-result.page';

describe('ThrombResultPage', () => {
  let component: ThrombResultPage;
  let fixture: ComponentFixture<ThrombResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
