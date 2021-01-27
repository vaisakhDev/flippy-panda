import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlayDialogComponent } from './play-dialog.component'

describe('PlayDialogComponent', () => {
  let component: PlayDialogComponent
  let fixture: ComponentFixture<PlayDialogComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PlayDialogComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  // it('should create', () => {
  //   expect(component).toBeTruthy()
  // })
})
