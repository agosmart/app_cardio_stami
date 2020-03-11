import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvisSosPage } from './avis-sos.page';

describe('AvisSosPage', () => {
  let component: AvisSosPage;
  let fixture: ComponentFixture<AvisSosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisSosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisSosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
