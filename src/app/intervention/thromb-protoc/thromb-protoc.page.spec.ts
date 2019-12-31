import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThrombProtocPage } from './thromb-protoc.page';

describe('ThrombProtocPage', () => {
  let component: ThrombProtocPage;
  let fixture: ComponentFixture<ThrombProtocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThrombProtocPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThrombProtocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
