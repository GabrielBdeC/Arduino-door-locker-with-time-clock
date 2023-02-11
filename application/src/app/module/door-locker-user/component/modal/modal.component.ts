import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoorLockerUserService } from '../../service/door-locker-user.service';

@Component({
  selector: 'door-locker-user-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class DoorLockerUserModalComponent {
  private requestedStoreRFID = false;
  private waitingRFIDResponse = false;
  private storedRFIDError = false;
  private ws: WebSocket;

  public formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    institutionCode: new FormControl('', [Validators.required]),
    authorization: new FormControl(true),
  });

  constructor(
    private dialogRef: MatDialogRef<DoorLockerUserModalComponent>,
    private doorLockerUserService: DoorLockerUserService
  ) { }

  public didRequestedStoreRFID() {
    return this.requestedStoreRFID;
  }

  public isWaitingRFIDResponse() {
    return this.waitingRFIDResponse;
  }

  public storedRFIDHasError() {
    return this.storedRFIDError;
  }

  public registerRFID() {
    this.ws = new WebSocket('ws://localhost:9228/api/door_locker/v1/locker');
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          event: 'rfid'
        })
      );
      this.requestedStoreRFID = true;
      this.waitingRFIDResponse = true;
    }
    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.data == "success") {
        this.waitingRFIDResponse = false;
        this.storedRFIDError = false;
      } else {
        this.waitingRFIDResponse = false;
        this.storedRFIDError = true;
      }
    }
    this.ws.onclose = () => {
      this.requestedStoreRFID = false;
      this.waitingRFIDResponse = false;
      //snack bar aqui, pois alguém já está usando
    };
    this.ws.onerror = () => {
      this.requestedStoreRFID = false;
      this.waitingRFIDResponse = false;
    };
  }

  public createUser(): void {
    if (this.formGroup.valid) {
      this.doorLockerUserService
        .create({
          name: this.formGroup.get('name')?.value!,
          institutionCode: this.formGroup.get('institutionCode')?.value!,
          authorization: this.formGroup.get('authorization')?.value!,
        })
        .subscribe(
          () => this.dialogRef.close('success'),
        );
    }
  }

  public cancelDialog(): void {
    this.dialogRef.close('closed');
  }
}

/*
export class DoorLockerUser extends Base {
  public name: string;
  public institutionCode: string;
  public rfid: string;
  public authorization: boolean;
}

0 - clicou no modal, aparece botão
1 - clicou no botão, aparece a letícia

2 - 1 - recebeu resultado, aparecer o V
2 - 2 - recebeu resultado, deu erro, aparece X
*/
