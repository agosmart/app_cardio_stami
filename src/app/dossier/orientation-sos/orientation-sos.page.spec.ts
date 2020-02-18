import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientationSosPage } from './orientation-sos.page';

describe('OrientationSosPage', () => {
  let component: OrientationSosPage;
  let fixture: ComponentFixture<OrientationSosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationSosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientationSosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
