import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DosageInfosPage } from './dosage-infos.page';

describe('DosageInfosPage', () => {
  let component: DosageInfosPage;
  let fixture: ComponentFixture<DosageInfosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DosageInfosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DosageInfosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
