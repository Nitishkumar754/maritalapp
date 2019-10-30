import { Injectable } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorDialogComponent } from './errordialog.component';

@Injectable()
export class ErrorDialogService {
    public isDialogOpen: Boolean = false;
    constructor() { }
    openDialog(data): any {
        if (this.isDialogOpen) {
            return false;
        }
        this.isDialogOpen = true;
        

        
    }
}