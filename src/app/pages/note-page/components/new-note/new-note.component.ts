import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Note } from 'src/app/models/note-model';
import { NoteService } from 'src/app/services/note.service';


@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss']
})
export class NewNoteComponent implements OnInit {

  @Input() defaultAlarm: Date;
  @Input() defaultLabel: string;
  @Input() numb: Number;
  @Input() note: Note;
  openTrigger: boolean = false;
  newNote: Note;
  routeChanged: boolean = false;
  fileProgress: boolean = false;
  cursorX: number;
  cursorY: number;


  constructor(
    private noteService: NoteService,
    public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
      }
      if (event instanceof NavigationEnd) {
        this.routeChanged = true;
      }
    })
  }

  ngOnInit(): void {
    this.newNote = this.generateEmptyNote();
  }

  // Generate empty note after changin main menu label
  ngAfterViewChecked() {
    if (this.routeChanged) {
      this.newNote = this.generateEmptyNote();
      this.routeChanged = false;
    }
  }
  // Static click event calls toggleNewNote component logic
  @HostListener('document:mousedown', ['$event'])
  mouseup(event) {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  mousedown(event) {
    let distanceX = Math.abs(this.cursorX - event.clientX);
    let distanceY = Math.abs(this.cursorY - event.clientY);
    if (distanceX < 8 && distanceY < 8) this.toggleNewNote(event);
  }

  // newNote element close/open logic
  toggleNewNote(event) {
    // If click inside element
    if (event.target.closest('.newNote') || event.target.classList.contains('clearBtn') || event.target.closest('.image-preview')) {

      if (event.target.className == "closeBtn") {
        this.closePanel();
      }

      else {
        this.openPanel();
      }

      // Else click outside
    } else {
      // Fix clicking in angular material overlays
      if (!event.target.closest(".cdk-overlay-container") && !event.target.closest(".mat-autocomplete-panel")) {
        this.closePanel()
      }
    }
  }

  closePanel() {
    if (!this.isNoteEmpty(this.newNote)) {
      this.addNote();
      this.clear();
      // console.log("add")
      // this.noteService.getNotesData();
    }
    this.openTrigger = false;
  }


  openPanel() {
    this.openTrigger = true;
  }

  isNoteEmpty(newNote: Note) {
    return this.noteService.checkNoteIsEmpty(newNote);
  }

  addNote() {
    this.noteService.addNote(this.newNote);
    // console.log(this.newNote);
  }

  clear() {
    this.newNote = this.generateEmptyNote();
  }


  // Generate empty note with default label/alarm after main menu label changin
  generateEmptyNote(): Note {
    let newNote = this.noteService.getEmptyNote();
    if (this.defaultLabel) newNote.labels.push(this.defaultLabel);
    if (this.defaultAlarm) newNote.date = this.defaultAlarm;

    return newNote;
  }

  // Input file loading event handler, shows progress bar
  setFileProgress(fileProgress: boolean) {
    this.fileProgress = fileProgress;
  }

  upload(event: any) {
    console.log(event);
    // this.noteService.changeImgURL(event,this.note.id,this.note.pin,"note");
    
  }

}
