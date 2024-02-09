import {
  FormGroup,
  ValidationErrors,
  FormControl,
  FormArray,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

export abstract class FormManage {
  private form!: FormGroup;
  constructor() {}

  setForm(form: FormGroup) {
    this.form = form;
  }

  markAllFeildsTouched(formGroup: FormGroup = this.form) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field) as
        | FormControl
        | FormGroup
        | FormArray;
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAllFeildsTouched(control);
      } else if (control instanceof FormArray) {
        this.markFormArrayControlsAsTouched(control);
      }
    });
  }

  markControllerTouched(controlName: string, formGroup: FormGroup = this.form) {
    const control = formGroup.get(controlName) as FormControl;
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    }
  }

  // Get FormArray and mark as touched
  markFormArrayControlsAsTouched(formArray: FormArray) {
    formArray.controls.forEach((formArrayControl) => {
      if (formArrayControl instanceof FormControl) {
        formArrayControl.markAsTouched({ onlySelf: true });
      } else if (formArrayControl instanceof FormGroup) {
        this.markAllFeildsTouched(formArrayControl);
      } else if (formArrayControl instanceof FormArray) {
        this.markFormArrayControlsAsTouched(formArrayControl);
      }
    });
  }

  isFieldInvalid(
    ControlName: string,
    formGroupName?: string,
    formArrayName?: string,
    controlIndex?: number
  ) {
    if (formArrayName) {
      if (ControlName) {
        const formGroup = (this.form.get(formArrayName) as FormArray).controls[
          controlIndex!!
        ] as FormGroup;
        return (
          (formGroup.controls[ControlName].touched ||
            formGroup.controls[ControlName].dirty) &&
          formGroup.controls[ControlName].invalid
        );
      } else {
        const formArray = (this.form.get(formArrayName) as FormArray).controls;
        return (
          (formArray[controlIndex!!].touched ||
            formArray[controlIndex!!].dirty) &&
          formArray[controlIndex!!].invalid
        );
      }
    } else if (formGroupName) {
      return (
        ((this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .touched ||
          (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
            .dirty) &&
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .invalid
      );
    } else {
      return (
        (this.form.controls[ControlName].touched ||
          this.form.controls[ControlName].dirty) &&
        this.form.controls[ControlName].invalid
      );
    }
  }

  isFieldValid(
    ControlName: string,
    formGroupName?: string,
    formArrayName?: string,
    controlIndex?: number
  ) {
    if (formArrayName) {
      if (ControlName) {
        const formGroup = (this.form.get(formArrayName) as FormArray).controls[
          controlIndex!!
        ] as FormGroup;
        return (
          (formGroup.controls[ControlName].touched ||
            formGroup.controls[ControlName].dirty) &&
          formGroup.controls[ControlName].valid
        );
      } else {
        const formArray = (this.form.get(formArrayName) as FormArray).controls;
        return (
          (formArray[controlIndex!!].touched ||
            formArray[controlIndex!!].dirty) &&
          formArray[controlIndex!!].valid
        );
      }
    } else if (formGroupName) {
      return (
        ((this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .touched ||
          (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
            .dirty) &&
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName]
          .valid
      );
    } else {
      return (
        (this.form.controls[ControlName].touched ||
          this.form.controls[ControlName].dirty) &&
        this.form.controls[ControlName].valid
      );
    }
  }

  setContollerValue(name: string, value: any) {
    this.form?.controls[name]?.setValue(value);
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors: ValidationErrors | undefined | null =
        this.form.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
        });
      }
    });
  }

  get isFormValid() {
    this.markAllFeildsTouched();
    return this.form.valid;
  }

  get FormValue() {
    return this.form.value;
  }

  resetForm() {
    this.form?.reset();
  }

  setFormErrors(errors: any) {
    Object.keys(errors).forEach((error) => {
      if (this.form.controls[error]) {
        this.form.controls[error].setErrors({ incorrect: true });
      }
    });
  }

  /**
   * set data to the form
   * @param data
   */
  setDataToForm(data: any) {
    Object.keys(data).forEach((key) => {
      if (this.form.controls[key]) {
        this.setContollerValue(key, data[key]);
      }
    });
  }

  addControllerTOTheForm(name: any, data: any, validators = []) {
    this.form.addControl(name, new FormControl(data, validators));
  }

  getControllerValue(name: any) {
    if (this.form.controls[name]) return this.form.controls[name].value;
  }

  getFormFieldErrors(name: any) {
    const controlErrors: ValidationErrors | null =
      this.form.controls[name].errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach((keyError) => {
      });
    }
    return controlErrors;
  }

  passwordValidator(
    confirmPassword: AbstractControl,
    errorKey: string,
    passwordControlName: string
  ) {
    if (confirmPassword.parent) {
      const parentForm = confirmPassword.parent as FormGroup;

      if (
        confirmPassword.value !== parentForm.get(passwordControlName)?.value
      ) {
        return { [errorKey]: true };
      } else {
        return null;
      }
    }

    return null;
  }

  // custom validator to check that two fields match
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  compareTwoTimes(startTimeControl: any, endTimeControl: any) {
    return (formGroup: FormGroup) => {
      const startTime = formGroup.controls[startTimeControl];
      const endTime = formGroup.controls[endTimeControl];

      if (startTime.value >= endTime.value) {
        endTime.setErrors({ invalidEndTime: true });
      } else {
        endTime.setErrors(null);
      }
    };
  }

  compareTwoDates(startDate: any, EndDate: any) {
    return (formGroup: FormGroup) => {
      const firstDate = formGroup.controls[startDate];
      const LastDate = formGroup.controls[EndDate];

      if (firstDate.value >= LastDate.value) {
        LastDate.setErrors({ invalidLastDate: true });
      } else {
        LastDate.setErrors(null);
      }
    };
  }

  getCurrentDate(day: any) {
    return (formGroup: FormGroup) => {
      const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
      const dayControls = formGroup.controls[day];
      if (dayControls.value < currentDate) {
        dayControls.setErrors({ invalidDate: true });
      } else {
        dayControls.setErrors(null);
      }
    };
  }

  isFieldTouched(controlName: string) {
    return this.form.controls[controlName].touched;
  }

  isFieldDirty(controlName: string) {
    return this.form.controls[controlName].dirty;
  }

  matchFields(
    firstControlName: string,
    secondControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const firstControl = formGroup.get(firstControlName);
      const secondControl = formGroup.get(secondControlName);

      return firstControl?.value === secondControl?.value
        ? null
        : { matchFields: { value: control.value } };
    };
  }
}
