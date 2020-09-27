import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RenameDeckDialogComponent } from './rename-deck-dialog.component'

describe('RenameDeckDialogComponent', () => {
  let component: RenameDeckDialogComponent
  let fixture: ComponentFixture<RenameDeckDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenameDeckDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameDeckDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  // it('should create', () => {
  //   expect(component).toBeTruthy()
  // })
})
