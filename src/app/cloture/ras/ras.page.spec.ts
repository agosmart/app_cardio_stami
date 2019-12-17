import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RasPage } from './ras.page';

describe('RasPage', () => {
  let component: RasPage;
  let fixture: ComponentFixture<RasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
