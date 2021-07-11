import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CommonService } from "../../common.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private common: CommonService,
    private spinner: NgxSpinnerService
  ) {}
  @ViewChild("f") emailForm: NgForm;
  @ViewChild("p") passwordResetForm: NgForm;

  success_message = "";
  error_message = "";
  email_response_pending = false;
  your_email = "";
  password_reset_form = false;
  email_otp_form = true;
  password_error_message = "";
  password_success_message = "";
  ngOnInit() {}
  send_password_reset_otp() {
    this.email_response_pending = true;
    this.spinner.show();
    this.your_email = this.emailForm.form.value.email;
    this.common
      .commonService(
        { email: this.emailForm.form.value.email },
        "POST",
        "user/update/password/otp"
      )
      .subscribe(
        (data: any) => {
          console.log("data ", data);
          this.success_message = data.message;
          this.error_message = "";
          this.email_response_pending = false;
          this.spinner.hide();
          this.password_reset_form = true;
          this.email_otp_form = false;
        },
        (error) => {
          this.error_message = error.error.message;
          this.success_message = "";
          console.log("error is ", error);
          this.email_response_pending = false;
          this.spinner.hide();
        }
      );
  }

  validate_password(pass, pass_re) {
    if (pass.length < 6) {
      this.password_error_message =
        "password must be atleast 6 characters long";
      return false;
    }
    if (pass.localeCompare(pass_re) != 0) {
      this.password_error_message = "Both password should match";
      return false;
    }
    return true;
  }

  update_password() {
    var pass = this.passwordResetForm.form.value.password;
    var pass_re = this.passwordResetForm.form.value.password_re;
    let otp = this.passwordResetForm.form.value.otp;
    if (!this.validate_password(pass, pass_re)) {
      return;
    }
    let request = {
      password: pass,
      otp: otp,
      email: this.your_email,
    };

    console.log("request", request);
    this.password_success_message = "";
    this.common
      .commonService(request, "POST", `user/update/password/request`)
      .subscribe(
        (data: any) => {
          console.log("data ", data);
          this.password_success_message = data.message;
          this.password_error_message = "";
        },
        (error) => {
          console.log("error ", error);
          this.password_error_message = error.error.message;
          this.password_success_message = "";
        }
      );
  }
}
