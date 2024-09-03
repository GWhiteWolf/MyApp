import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageComponentPage } from './page-component.page';

describe('PageComponentPage', () => {
  let component: PageComponentPage;
  let fixture: ComponentFixture<PageComponentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
