import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TreinosPage } from './treinos.page';

describe('TreinosPage', () => {
  let component: TreinosPage;
  let fixture: ComponentFixture<TreinosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreinosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TreinosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
