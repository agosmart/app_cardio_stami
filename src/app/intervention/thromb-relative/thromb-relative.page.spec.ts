import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombRelativePage } from './thromb-relative.page';

describe('ThrombRelativePage', () => {
  let component: ThrombRelativePage;
  let fixture: ComponentFixture<ThrombRelativePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombRelativePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombRelativePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
