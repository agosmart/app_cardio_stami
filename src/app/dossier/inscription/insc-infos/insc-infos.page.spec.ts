import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InscInfosPage } from './insc-infos.page';

describe('InscInfosPage', () => {
  let component: InscInfosPage;
  let fixture: ComponentFixture<InscInfosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscInfosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InscInfosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
