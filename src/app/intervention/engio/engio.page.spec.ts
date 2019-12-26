import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EngioPage } from './engio.page';

describe('EngioPage', () => {
  let component: EngioPage;
  let fixture: ComponentFixture<EngioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EngioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
