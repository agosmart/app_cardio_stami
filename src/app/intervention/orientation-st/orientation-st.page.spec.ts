import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationStPage } from './orientation-st.page';

describe('OrientationStPage', () => {
  let component: OrientationStPage;
  let fixture: ComponentFixture<OrientationStPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationStPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationStPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
