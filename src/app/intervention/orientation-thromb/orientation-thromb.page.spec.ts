import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationThrombPage } from './orientation-thromb.page';

describe('OrientationThrombPage', () => {
  let component: OrientationThrombPage;
  let fixture: ComponentFixture<OrientationThrombPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationThrombPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationThrombPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
