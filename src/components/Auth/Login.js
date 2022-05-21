/* eslint-disable */

import React from "react";
import store from "store";
import $ from "jquery";
import {
	AjaxSetup,
	API_LOGIN,
	API_SHORT_PROFILE,
	API_VERIFY_EMAIL,
	QueryParam,
	BASE_URL
} from "../Util";
import { notify } from "react-notify-toast";
import Page from "../Page";
import GoogleLogin from "react-google-login";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import "../../styles/captcha.css";
import "../../styles/login.css";

class Login extends Page {
	static GOOGLE = "google";
	static EMAIL = "email";

	static GOOGLE_CLIENT_ID =
		"887187980522-qrj2gp2suj45u24e1quhgr2ruhgbvhar.apps.googleusercontent.com";
	static CLIENT_WEB = "web";

	static CLIENT_TOKEN = "aa6d8694eea3d1b52aa6e4169b0a822665b56fc4"; // skydu
	static CLIENT_TOKEN_GOOGLE = "ef82ef838e94ff1f3bfe43cadb7eb569b954d196"; // skydu

	constructor(props) {
		super(props);
		let params = QueryParam();

		this.state = {
			username: "",
			password: "",
			token: params.token,
			api_token: params.api_token,
			is_password_hidden: true,
			is_valid_username: true,
			set_failed_counter: 3,
			set_countdown: 60,
			activation_token: params.token,
			email: params.email
		};

		this.regexEmail = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
	}

	componentDidMount() {
		let { api_token } = this.state;

		if (QueryParam("redirect")) {
			notify.show("Anda harus login terlebih dahulu", "warning", 3000);
		}
		if (api_token) {
			store.set("auth_token", "Bearer " + api_token);
			this.grabProfile(api_token);
		}
		let { email, activation_token } = this.state;

		if (email && activation_token) {
			this.handleVerifyEmail(email, activation_token);
		}
	}

	handleVerifyEmail = (email, token) => {
		console.log("HANDLE VERIFY EMAIL - EMAIL >>> ", email);
		console.log("HANDLE VERIFY EMAIL - TOKEN >>> ", token);
		$.post(API_VERIFY_EMAIL, { email: email, token: token }).then(result => {
			if (result.status === "failed") {
				notify.show(result.message, "danger", 3000);
			} else {
				notify.show(result.payload, "success", 3000);
			}
		});
	};

	handleSubmitForm = async e => {
		e.preventDefault();
		let { username, password } = this.state;

		if (username && password) {
			if (username.length < 10 || password.length < 6) {
				this.setState({
					is_valid_username: username.length < 10 ? false : true,
					is_valid_password: password.length < 5 ? false : true
				});
			} else {
				this.handleLogin({
					username: username,
					password: password,
					login_type: Login.EMAIL,
					client_token: Login.CLIENT_TOKEN
				});
			}
		} else {
			notify.show("Email dan password tidak boleh kosong", "warning");
		}
	};

	handleLogin = param => {
		console.log("PARAMS >>> ", param);

		$.post(API_LOGIN, param)
			.then(data => {
				if (data.payload) {
					store.set("auth_token", "Bearer " + data.payload.token);
					this.grabProfile(data.payload.token);
				} else {
					notify.show(
						"Terdapat kesalahan dalam melakukan login, silakan coba lagi",
						"warning"
					);
					this.setState({ loading: false });
				}
			})
			.fail(XMLHttpRequest => {
				let response;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) { }
				if (response && response.status) {
					// notify.show("Username atau password salah", "warning");
					// notify.show("SELESAIKAN REGISTRASI ANDA DENGAN MEMBUKA EMAIL ANDA DAN LAKUKAN					AKTIVASI AKUN DENGAN MENG-KLIK TOMBOL “ACTIVATE ACCOUNT", "error");
					notify.show(response.message, "error");
				}
			});
	};

	responseGoogle = response => {
		let { username } = this.state;
		console.log(response);

		if (response.googleId) {
			this.handleLogin({
				username: response.profileObj.email,
				email: response.profileObj.email,
				password: response.tokenId,
				login_type: Login.GOOGLE,
				client_platform: Login.CLIENT_WEB,
				client_token: Login.CLIENT_TOKEN_GOOGLE
			});
		}
	};

	grabProfile = () => {
		AjaxSetup(this.props);

		$.get(API_SHORT_PROFILE).then(data => {
			if (data.payload) {
				let {
					name,
					email,
					avatar_url,
					account_type,
					username,
					is_businessman,
					phone,
					...rest
				} = data.payload;

				let userdata = {
					nama: name,
					email: email,
					foto: avatar_url ? avatar_url : BASE_URL + "/img/avatar.png",
					account_type: account_type,
					saldo: rest.deposit_balance,
					saldoput: rest.put_balance,
					agenid: username,
					is_businessman: is_businessman,
					phone: phone
				};

				store.set("userdata", userdata);

				this.redirectAfterLogin();
			}
		});
	};

	redirectAfterLogin = async () => {
		let redirect = QueryParam("redirect");

		if (!redirect || redirect === "/login") {
			redirect = "/";
		}
		await this.props.history.push(redirect, { needRefresh: true, login: 1 });
		window.location.reload()
	};

	handleUsernameChange = e => {
		this.setState({ username: e.target.value });
	};

	handlePasswordChange = e => {
		this.setState({ password: e.target.value });
	};

	handleToggleShowPassword = () => {
		this.setState({ is_password_hidden: !this.state.is_password_hidden });
	};

	render() {
		return (
			<div>
				<div className="pt-m mb-xl">
					<form
						id="form-login"
						className="form-auth bg-white"
						onSubmit={this.handleSubmitForm}
					>
						<div className="px-l py-m inline-block full-width">
							<div className="center mb-s">
								<img
									className="form-auth-header-logo"
									src={BASE_URL + "/img/white-label/logo/logo.png"}
								/>
							</div>

							<div className="input-field">
								<input
									required
									id="username"
									type="email"
									value={this.state.username}
									onChange={this.handleUsernameChange}
									className="validate"
								/>
								<label htmlFor="username">Email</label>
								{!this.state.is_valid_username && (
									<span className="helper-text font-orange-red inline-block font-tiny">
										Email tidak valid
									</span>
								)}
							</div>

							<div className="input-field">
								<input
									required
									id="password"
									type={this.state.is_password_hidden ? "password" : "text"}
									value={this.state.password}
									onChange={this.handlePasswordChange}
									className="validate"
								/>
								<i
									className="btn-show-hide-password material-icons"
									onClick={this.handleToggleShowPassword}
								>
									{this.state.is_password_hidden
										? "visibility_off"
										: "visibility"}
								</i>
								<label htmlFor="password">Password</label>
							</div>

							<div className="form-auth__forgot-password">
								<Link className="font-orange" to="/forgot-password">
									Lupa Password?
								</Link>
							</div>

							<div className="form-auth__button-group mt-s">
								<button className="btn full mb-s modal-trigger">Masuk</button>
								<div className="btn-login-divider">
									<span>Atau login dengan</span>
								</div>
								<GoogleLogin
									clientId={Login.GOOGLE_CLIENT_ID}
									buttonText={
										<span>
											<FontAwesome name="google" /> &nbsp;Google
										</span>
									}
									className="btn btn-gl full"
									onSuccess={this.responseGoogle}
									onFailure={this.responseGoogle}
								/>
								<div className="font-small mt-sxs center lined-text">
									<span>
										Belum punya akun?{" "}
										<Link className="font-orange bold" to="/register">
											Buat disini
										</Link>
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
