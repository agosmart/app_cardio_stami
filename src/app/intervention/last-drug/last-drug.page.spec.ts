import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LastDrugPage } from './last-drug.page';

describe('LastDrugPage', () => {
  let component: LastDrugPage;
  let fixture: ComponentFixture<LastDrugPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastDrugPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LastDrugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
