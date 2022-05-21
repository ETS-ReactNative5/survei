/* eslint-disable */

import React, { Component } from 'react';
import $ from 'jquery';
import { API_PASSWORD_FORGET } from '../Util';
import {notify} from 'react-notify-toast';
import Login from './Login';

class ForgotPassword extends Login {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: ''
      },
      formErrors: {
        errorEmail: ''
      }
    }
    this.otpSession = '23e2e32ds2';
    this.clientToken = 'aa6d8694eea3d1b52aa6e4169b0a822665b56fc4';
    this.regexEmail = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.checkIsFormValid()) {
      let {countryCode, email} = this.state.formData;

      $.post(API_PASSWORD_FORGET, {"email": email}).then((data) => {
        if (data.status === 'success') {
          //dataForgotPassword = Object.assign({}, dataForgotPassword, data.payload);
          //this.handleSendOTP(params, dataForgotPassword);
          notify.show("Silakan cek email Anda untuk mereset password", "success");
        } else {
          notify.show("Terjadi kesalahan: " + data.message, "warning");
        }
        this.state.formData.email = '';
      });
    }
  }

  checkIsFormValid = () => {
    let {email} = this.state.formData;
    let {formErrors} = this.state;
    let isValid = true;

    // Phone Number Validation
    if (!email) {
      formErrors.errorEmail = "Email tidak boleh kosong";
    } else if (!this.regexEmail.test(email)) {
      formErrors.errorEmail = "Email yang anda masukkan tidak valid";
    } else {
      formErrors.errorEmail = "";
    }

    this.setState({formErrors})

    // RETURN ISVALID
    Object.values(formErrors).forEach((value) => {
      if (value) {
        this.setState
        isValid = false;
      }
    });

    return isValid;
  }

  handleChange = (e) => {
    let {value,name} = e.target;
    let {formData} = this.state;

    switch (name) {
      case "countryCode":
        formData.countryCode = value;
        break;
      case "email":
        formData.email = value;
        break;
      default:
        break;
    }

    this.setState({formData});
  }

  render() {
    let {countryCode, email} = this.state.formData;
    let {errorEmail} = this.state.formErrors;

    return (
      <div>
        <div className="pt-m mb-xl">
          <form id="form-forgot-password" onSubmit={this.handleSubmit} className="form-auth bg-white">
            <div className="px-l py-m inline-block full-width">
              <div className="mb-s">
                <div className="font-largest font-heavy mt-0 mb-xss">Lupa Password</div>
                <span>Kami akan mengirim link untuk mereset ulang password kamu.</span>
              </div>

              <div className="input-field row">
                <input
                  name="email"
                  type="email"
									placeholder="Email"
                  className="col s12"
                  onChange={this.handleChange}
                  value={email}
                />
                <div className="helper-text font-orange-red inline-block font-tiny">
                  {errorEmail}
                </div>
              </div>

              <div className="form-auth__button-group mt-s">
                <button className="btn full mb-s modal-trigger">Reset Password</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;