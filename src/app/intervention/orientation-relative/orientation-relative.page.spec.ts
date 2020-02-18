import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationRelativePage } from './orientation-relative.page';

describe('OrientationRelativePage', () => {
  let component: OrientationRelativePage;
  let fixture: ComponentFixture<OrientationRelativePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationRelativePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationRelativePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
