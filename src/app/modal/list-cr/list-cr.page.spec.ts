import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCrPage } from './list-cr.page';

describe('ListCrPage', () => {
  let component: ListCrPage;
  let fixture: ComponentFixture<ListCrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
