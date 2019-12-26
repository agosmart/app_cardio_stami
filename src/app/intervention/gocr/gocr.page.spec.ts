import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GocrPage } from './gocr.page';

describe('GocrPage', () => {
  let component: GocrPage;
  let fixture: ComponentFixture<GocrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GocrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GocrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
