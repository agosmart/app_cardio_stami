import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationPage } from './orientation.page';

describe('OrientationPage', () => {
  let component: OrientationPage;
  let fixture: ComponentFixture<OrientationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
