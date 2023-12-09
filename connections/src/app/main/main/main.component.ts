import { Component } from '@angular/core';
import { GroupUpdateResponse } from '../models/group.model';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  // Add any properties you need for your component here

  constructor(private groupService: GroupService) {}

  update() {
    console.log('Update button clicked');
    this.groupService.updateGroupList().subscribe(
      (response: GroupUpdateResponse) => {
        console.log('Group list updated:', response);
        // Handle the response here, e.g., update your component's state with the new data
      },
      (error) => {
        console.error('Error updating group list:', error.message);
        // Handle the error here
      }
    );
  }
}
