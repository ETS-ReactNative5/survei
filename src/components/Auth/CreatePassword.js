import React from "react";
import store from "store";
import $ from "jquery";
import {
	AjaxSetup,
	CheckAuth,
	API_CREATE_PASSWORD,
	API_SHORT_PROFILE,
	BASE_URL
} from "../Util";
import { notify } from "react-notify-toast";
import Page from "../Page";
import PopUp from "../Reuseables/PopUp";

class CreatePassword extends Page {
	static PAYTREN = "paytren";

	constructor(props) {
		super(props);

		this.state = {
			formData: {
				fullname: "",
				phoneNumber: "",
				email: "",
				password: "",
				confirmPassword: ""
			},
			formErrors: {
				errorFullname: "",
				errorPhoneNumber: "",
				errorEmail: "",
				errorPassword: "",
				errorConfirmPassword: ""
			},
			isPasswordHidden: true,
			isConfirmPasswordHidden: true,
			isDisabledPhoneNumber: false,
			dataLoginPaytren: false,
			popupTitle: "",
			popupDesc: "",
			popupShow: false,
			popupSuccess: false,
			popupRedirect: ""
		};
		this.emailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		this.passwordRegex = RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).*$/);
	}

	componentDidMount = () => {
		let { formData, dataLoginPaytren } = this.state;
		let locationState = this.props.location.state;

		if (CheckAuth()) {
			formData.fullname = CheckAuth().nama;
			formData.phoneNumber = CheckAuth().phone;
			formData.email = CheckAuth().email;

			this.setState({ isDisabledPhoneNumber: true });
		} else if (locationState) {
			if (locationState.dataForgotPassword) {
				let dataForgotPassword = locationState.dataForgotPassword;

				formData.fullname = dataForgotPassword.name;
				formData.phoneNumber = dataForgotPassword.phone;
				formData.email = dataForgotPassword.email;

				this.setState({
					isDisabledPhoneNumber: dataForgotPassword.phone ? true : false
				});
			} else if (locationState.dataLoginPaytren) {
				let dataLoginPaytren = locationState.dataLoginPaytren;

				formData.fullname = dataLoginPaytren.profile.name;
				formData.phoneNumber = dataLoginPaytren.profile.phone;
				formData.email = dataLoginPaytren.profile.email;

				this.setState({
					dataLoginPaytren: locationState.dataLoginPaytren,
					isDisabledPhoneNumber: locationState.dataLoginPaytren ? true : false
				});
			} else {
				this.props.history.push("/");
			}

			this.setState({ formData });
		} else {
			this.props.history.push("/");
		}
	};

	handleChange = e => {
		let { value, name } = e.target;
		let { formData } = this.state;

		switch (name) {
			case "fullname":
				formData.fullname = value;
				break;
			case "email":
				formData.email = value;
				break;
			case "phoneNumber":
				formData.phoneNumber = value;
				break;
			case "password":
				formData.password = value;
				break;
			case "confirmPassword":
				formData.confirmPassword = value;
				break;
			default:
				break;
		}

		this.setState({ formData });
	};

	handleSubmit = async e => {
		e.preventDefault();
		let { formErrors } = this.state;
		let {
			fullname,
			phoneNumber,
			email,
			password,
			confirmPassword
		} = this.state.formData;

		formErrors.errorFullname = !fullname ? "Nama tidak valid" : "";
		formErrors.errorPhoneNumber =
			!phoneNumber || phoneNumber.length < 10 || isNaN(phoneNumber)
				? "Nomor handphone tidak valid"
				: "";
		formErrors.errorEmail =
			!email || !this.emailRegex.test(email) ? "Email tidak valid" : "";

		if (!password) {
			formErrors.errorPassword = "Password tidak boleh kosong";
		} else if (password.length < 6) {
			formErrors.errorPassword = "Password minimal 6 karakter";
		} else if (!this.passwordRegex.test(password)) {
			formErrors.errorPassword = "Password harus mengandung huruf dan angka";
		} else {
			formErrors.errorPassword = "";
			formErrors.errorConfirmPassword =
				password !== confirmPassword ? "Password tidak sesuai" : "";
		}

		this.setState({ formErrors });

		if (this.checkIsFormValid()) {
			let { formData } = this.state;
			let data = {
				new_password: formData.password,
				email: formData.email
			};

			this.createPassword(data);
		}
	};

	createPassword = params => {
		$.post(API_CREATE_PASSWORD, params)
			.then(data => {
				if (data.payload) {
					store.set("auth_token", "Bearer " + data.payload.token);
					if (
						params.login_type === CreatePassword.PAYTREN ||
						params.confirm_password
					) {
						this.props.history.push("/", { needRefresh: true });
					} else {
						this.grabProfile(data.payload.token);
					}

					this.setState({
						popupShow: true,
						popupSuccess: true,
						popupTitle: "Keamanan Akun Kamu Berhasil Ditingkatkan!",
						popupDesc:
							"Terima kasih telah meningkatkan keamanan akun GeTI Online kamu. Tekan selesai untuk menikmati kembali modulmu.",
						popupRedirect: "/"
					});
				} else {
					notify.show(
						"Terdapat kesalahan dalam melakukan login, silakan coba lagi",
						"warning"
					);
				}
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				var response = null;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) {}

				if (response && response.status) {
					this.setState({
						popupShow: true,
						popupSuccess: false,
						popupTitle: "Ups... Server Kami Sedang Penuh",
						popupDesc: "Coba kembali beberapa saat lagi."
					});
				}
			});
	};

	grabProfile = token => {
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

				this.props.history.push("/", { needRefresh: true });
			}
		});
	};

	checkIsFormValid = () => {
		let { formErrors } = this.state;
		let isValid = true;

		Object.values(formErrors).forEach(value => {
			if (value) isValid = false;
		});

		return isValid;
	};

	handleToggleShowPassword = e => {
		let { id } = e.target;
		if (id === "password")
			this.setState({ isPasswordHidden: !this.state.isPasswordHidden });
		if (id === "confirmPassword")
			this.setState({
				isConfirmPasswordHidden: !this.state.isConfirmPasswordHidden
			});
	};

	hidePopup = () => this.setState({ popupShow: false });

	render() {
		let { fullname, phoneNumber, email } = this.state.formData;
		let {
			errorFullname,
			errorPhoneNumber,
			errorEmail,
			errorPassword,
			errorConfirmPassword
		} = this.state.formErrors;
		let {
			isPasswordHidden,
			isConfirmPasswordHidden,
			isDisabledPhoneNumber,
			dataLoginPaytren
		} = this.state;

		return (
			<div>
				<div className="pt-m mb-xl">
					<form
						id="form-create-password"
						onSubmit={this.handleSubmit}
						className="form-auth bg-white"
					>
						<div className="px-l py-m inline-block full-width">
							<div className="mb-s">
								<div className="font-largest font-heavy mt-0 mb-xss">
									Tingkatkan Keamanan
								</div>
								<span>
									Demi meningkatkan keamanan akun GeTI Online kamu, yuk lengkapi
									data akunmu.
								</span>
							</div>

							<div className="input-field">
								<input
									name="fullname"
									type="text"
									placeholder="Nama Lengkap"
									disabled
									onChange={this.handleChange}
									value={fullname}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorFullname}
								</div>
							</div>
							<div className="input-field">
								<input
									name="phoneNumber"
									type="tel"
									placeholder="Nomor Handphone"
									onChange={this.handleChange}
									disabled={
										isDisabledPhoneNumber || dataLoginPaytren ? "disabled" : ""
									}
									value={phoneNumber}
									required
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorPhoneNumber}
								</div>
							</div>
							<div className="input-field">
								<input
									name="email"
									type="email"
									placeholder="Email"
									onChange={this.handleChange}
									value={email}
									required
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorEmail}
								</div>
							</div>
							<div className="input-field">
								<input
									name="password"
									placeholder="Buat Password"
									type={isPasswordHidden ? "password" : "text"}
									onChange={this.handleChange}
									required
								/>
								<i
									id="password"
									className="btn-show-hide-password material-icons"
									onClick={this.handleToggleShowPassword}
								>
									{isPasswordHidden ? "visibility_off" : "visibility"}
								</i>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorPassword}
								</div>
							</div>
							<div className="input-field">
								<input
									name="confirmPassword"
									placeholder="Konfirmasi Password"
									onChange={this.handleChange}
									type={isConfirmPasswordHidden ? "password" : "text"}
									required
								/>
								<i
									id="confirmPassword"
									className="btn-show-hide-password material-icons"
									onClick={this.handleToggleShowPassword}
								>
									{isConfirmPasswordHidden ? "visibility_off" : "visibility"}
								</i>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorConfirmPassword}
								</div>
							</div>
							<div className="form-auth__button-group mt-s">
								<button className="btn full mb-s modal-trigger">Masuk</button>
							</div>
						</div>
					</form>
				</div>
				{this.state.popupShow && (
					<PopUp
						title={this.state.popupTitle}
						status={this.state.popupSuccess}
						desc={this.state.popupDesc}
						buttonTextSuccess="Selesai"
						buttonTextError="Kembali"
						hidePopup={this.hidePopup}
						redirectSuccess={this.state.popupRedirect}
					/>
				)}
			</div>
		);
	}
}

export default CreatePassword;
