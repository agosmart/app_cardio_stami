import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationAbsoluPage } from './orientation-absolu.page';

describe('OrientationAbsoluPage', () => {
  let component: OrientationAbsoluPage;
  let fixture: ComponentFixture<OrientationAbsoluPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationAbsoluPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationAbsoluPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
