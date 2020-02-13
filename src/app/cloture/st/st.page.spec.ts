import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StPage } from './st.page';

describe('StPage', () => {
  let component: StPage;
  let fixture: ComponentFixture<StPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
