import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class DirtyErrorStateMatcher implements ErrorStateMatcher {
    // eslint-disable-next-line class-methods-use-this
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        return !!(
            control
      && control.invalid
      && (control.dirty || (form && form.submitted))
        );
    }
}
