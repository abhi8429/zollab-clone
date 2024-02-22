import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CommonServices {
  getFormattedTime(date: string) {
    const currentDate = new Date();
    const inputDate = new Date(date);
    const timezoneOffset = currentDate.getTimezoneOffset();
    inputDate.setMinutes(inputDate.getMinutes() - timezoneOffset);
    const providedDate = new Date(inputDate);
    const timeDifference: number = currentDate.getTime() - providedDate.getTime() + 3000;
    const secondsDifference: number = Math.floor(timeDifference / 1000);
    if (secondsDifference < 60) {
      return `${secondsDifference} sec${secondsDifference !== 1 ? 's' : ''}`;
    }
    const minutesDifference: number = Math.floor(secondsDifference / 60);
    if (minutesDifference < 60) {
      return `${minutesDifference} min${minutesDifference !== 1 ? 's' : ''}`;
    }
    const hoursDifference: number = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return `${hoursDifference} hr${hoursDifference !== 1 ? 's' : ''}`;
    }
    const daysDifference: number = Math.floor(hoursDifference / 24);
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''}`;
  }
}