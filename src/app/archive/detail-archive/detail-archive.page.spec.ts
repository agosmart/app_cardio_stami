import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailArchivePage } from './detail-archive.page';

describe('DetailArchivePage', () => {
  let component: DetailArchivePage;
  let fixture: ComponentFixture<DetailArchivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailArchivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailArchivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
