import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastrService: ToastrService) {
  }

  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      switch (err.status) {
        case 400:
          // errorMessage = `${!!err.error.globalErrors ? err.error.globalErrors[0].defaultMessage : err.error.error_description}`;
          errorMessage = this.getMessage(err.error)
          break;
        case 401:
          errorMessage = `Unauthorized`;
          break;
        case 403:
          errorMessage = `You dont have permission to access the requested resource`;
          break;
        case 404:
          errorMessage = `The requested resource does not exist`;
          break;
        case 412:
          errorMessage = `Precondition Failed`;
          break;
        case 500:
          errorMessage = `Internal Server Error`;
          break;
        case 503:
          errorMessage = `Service Unavailable`;
          break;
        default:
          errorMessage = `Something went wrong`;
      }
    }
    this.toastrService.error(errorMessage, "Error", {onActivateTick: true});
  }

  getMessage(globalErrors: any): string {
    let errorMsg = '';
    if (!globalErrors) {
      return errorMsg;
    }
    if(!globalErrors.allErrors) {
      return globalErrors.error_description;
    }
    let allErrors = globalErrors.allErrors;
    for (let i = 0; i < allErrors.length; i++) {
      if (allErrors[i].defaultMessage) {
        errorMsg += allErrors[i].defaultMessage + '\n';
      } else {
        errorMsg += allErrors[i].code + '\n';
      }
    }
    return errorMsg;
  }
}
