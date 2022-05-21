/* eslint-disable */

import $ from "jquery";
import React from "react";
import { notify } from "react-notify-toast";
import { API_REGISTER, API_GET_CITY, API_GET_EDUCATION, API_GET_PROVINCE } from "../Util";
import Login from "./Login";
import "../../styles/register.css";

class Register extends Login {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				fullname: "",
				phoneNumber: "",
				email: "",
				dateOfBirth: "",
				gender: "",
				study: "",
				domisili: "",
				password: "",
				city_id: '',
				province: '',
				province_id: '',
				confirmPassword: ""
			},
			formErrors: {
				errorFullname: "",
				errorPhoneNumber: "",
				errorEmail: "",
				errorDateOfBirth: "",
				errorStudy: "",
				errorGender: "",
				errorDomisili: "",
				errorProvince: "",
				errorPassword: "",
				errorConfirmPassword: ""
			},
			dateFormType: 'text',
			formGenderTextColor: "text-grey",
			formStudyTextColor: "text-grey",
			autoCompleteVisibility: {
				province: false,
				city: false
			},
			autoCompleteActive: {
				province: false,
				city: false
			},
			pointer: {
				province: 0,
				city: 0,
			},
			startPointer: false,
			citiesData: [],
			educationsData: [],
			provincesData: [],
			provincesData_filtered: [],
			genderData: ["L", "P"],
			isPasswordHidden: true,
			isConfirmPasswordHidden: true
		};
		this.regexFullname = RegExp(/^[A-Za-z ]+$/);
		this.regexEmail = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		this.regexSpecialCharacter = RegExp(
			/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
		);
		this.regexPassword = RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).*$/);
		this.regexDate = RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);
		this.clientToken = "aa6d8694eea3d1b52aa6e4169b0a822665b56fc4";
	}

	checkInputValidity = (array, data) => {
		return array.find(item => item == data) ? true : false;
	}

	checkCityAndProvince = (array, data) => {
		return array.find(item => item.name == data) ? true : false;
	}

	handleChange = e => {
		let { value, name } = e.target;
		let { formData } = this.state;

		switch (name) {
			case "fullname":
				formData.fullname = value;
				break;
			case "phoneNumber":
				formData.phoneNumber = value;
				break;
			case "email":
				formData.email = value;
				break;
			case "dateOfBirth":
				formData.dateOfBirth = value;
				break;
			case "provinsi":
				formData.province = value;
				this.loadProvincesData_filtered(value)
				this.setState({
					autoCompleteVisibility: {
						province: true,
						city: false
					}
				});
				this.state.pointer.province = 0;
				break;
			case "domisili":
				formData.domisili = value;
				this.loadCitiesData(value, this.state.formData.province_id);
				this.setState({
					autoCompleteVisibility: {
						province: false,
						city: true
					},
					startEditDomisili: true
				});
				break;
			case "study":
				formData.study = value;
				this.setState({ formStudyTextColor: value != "" ? "text-inherit" : "text-grey" });
				break;
			case "gender":
				formData.gender = value;
				this.setState({ formGenderTextColor: value != "" ? "text-inherit" : "text-grey" });
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
		if (this.checkIsFormValid()) {
			let { fullname, phoneNumber, email, password, dateOfBirth, gender, study, domisili, city_id, province, province_id } = this.state.formData;
			let params, dataRegister;

			params = {
				phone: phoneNumber,
				"g-recaptcha-response": "zzz"
			};

			dataRegister = {
				name: fullname,
				phone: phoneNumber,
				password: password,
				birth_date: dateOfBirth,
				gender: gender.toUpperCase(),
				education: study.toUpperCase(),
				city: domisili.toUpperCase(),
				city_id: city_id,
				province: province,
				province_id, province_id,
				email: email
			};

			this.handleRegister(params, dataRegister);
		}
	};

	handleRegister = (params, dataRegister) => {
		let dataTemp = {
			client_token: this.clientToken,
			device_token: ""
		};

		dataRegister = Object.assign({}, dataRegister, dataTemp);


		$.post(API_REGISTER, dataRegister)
			.then(data => {
				if (data.payload) {
					// notify.show(
					// 	"Terima kasih sudah mendaftar di GeTI Online, Mohon cek email Anda terlebih dahulu untuk aktivasi email.",
					// 	"success"
					// );
					notify.show(
						"Terima kasih, selesaikan registrasi Anda dengan membuka email Anda dan lakukan aktivasi akun dengan meng-klik tombol 'Activate Account'",
						"error"
					);
					this.props.history.push("/login");
				} else {
					notify.show("Terdapat kesalahan, silakan coba lagi", "warning");
				}
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				let response;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) { }

				if (response && response.status) {
					if (response.errors) {
						notify.show(response.errors.email[0], "warning");
					} else {
						notify.show(response.message, "warning");
					}
				}
			});
	};

	checkIsFormValid = () => {
		let {
			fullname,
			phoneNumber,
			email,
			password,
			dateOfBirth,
			study,
			gender,
			domisili,
			province,
			confirmPassword
		} = this.state.formData;
		let { formErrors } = this.state;
		let isValid = true;

		// Fullname Validation
		if (!fullname) {
			formErrors.errorFullname = "Nama tidak boleh kosong";
		} else if (!this.regexFullname.test(fullname)) {
			formErrors.errorFullname = "Hanya dapat memasukkan huruf";
		} else {
			formErrors.errorFullname = "";
		}

		// Phone Number Validation
		if (!phoneNumber) {
			formErrors.errorPhoneNumber = "Nomor handphone tidak boleh kosong";
		} else if (!phoneNumber || phoneNumber.length < 10 || isNaN(phoneNumber)) {
			formErrors.errorPhoneNumber =
				"Nomor handphone yang anda masukkan tidak valid";
		} else {
			formErrors.errorPhoneNumber = "";
		}

		// Email Validation
		if (!email) {
			formErrors.errorEmail = "Email tidak boleh kosong";
		} else if (!this.regexEmail.test(email)) {
			formErrors.errorEmail = "Email yang anda masukkan tidak valid";
		} else {
			formErrors.errorEmail = "";
		}

		// Date of Birth Validation
		if (!dateOfBirth) {
			formErrors.errorDateOfBirth = "Tanggal Lahir tidak boleh kosong";
		} else if (!this.regexDate.test(dateOfBirth)) {
			formErrors.errorDateOfBirth = "Tanggal tidak valid";
		} else {
			formErrors.errorDateOfBirth = "";
		}

		// Study Validation
		if (!study) {
			formErrors.errorStudy = "Pendidikan tidak boleh kosong";
		} else if (!this.checkInputValidity(this.state.educationsData, study)) {
			formErrors.errorStudy = "Pendidikan tidak valid";
		} else {
			formErrors.errorStudy = "";
		}

		// Gender Validation
		if (!gender) {
			formErrors.errorGender = "Jenis Kelamin tidak boleh kosong";
		} else if (!this.checkInputValidity(this.state.genderData, gender)) {
			formErrors.errorGender = "Jenis Kelamin tidak valid";
		} else {
			formErrors.errorGender = "";
		}

		// Domisili Validation
		if (!domisili) {
			formErrors.errorDomisili = "Domisili tidak boleh kosong";
		} else if (!this.checkCityAndProvince(this.state.citiesData, domisili)) {
			formErrors.errorDomisili = "Kota Domisili tidak valid. Harap pilih dari list yang sudah disediakan";
		} else {
			formErrors.errorDomisili = "";
		}

		// Province Validation
		if (!province) {
			formErrors.errorProvince = "Provinsi tidak boleh kosong";
		} else if (!this.checkCityAndProvince(this.state.provincesData, province)) {
			formErrors.errorProvince = "Provinsi tidak valid. Harap pilih dari list yang sudah disediakan";
		} else {
			formErrors.errorProvince = "";
		}

		// Password Validation
		if (!password) {
			formErrors.errorPassword = "Password tidak boleh kosong";
		} else if (password.length < 6) {
			formErrors.errorPassword = "Minimal password 6 karakter";
		} else if (!this.regexPassword.test(password)) {
			formErrors.errorPassword = "Password harus mengandung huruf dan angka";
		} else {
			formErrors.errorPassword = "";
			formErrors.errorConfirmPassword =
				password !== confirmPassword
					? "Password yang anda masukkan tidak sesuai"
					: "";
		}

		this.setState({ formErrors });

		// RETURN ISVALID
		Object.values(formErrors).forEach(value => {
			if (value) {
				this.setState;
				isValid = false;
			}
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

	handleDateForm = (state) => {
		state == true ? this.setState({ dateFormType: 'date' }) : this.setState({ dateFormType: 'text' });
	}

	handleAutocompleteBlur = (type) => {
		if (this.state.startPointer) {
			if (type == 'province') {
				this.selectProvince(this.state.provincesData_filtered[this.state.pointer.province]);
			} else if (type == 'city') {
				this.selectCity(this.state.citiesData[this.state.pointer.city]);
			}

			this.state.startPointer = false;
		}

		let { autoCompleteVisibility } = this.state;

		if (this.state.autoCompleteActive[type] == false) {
			autoCompleteVisibility[type] = false;

			this.setState({ autoCompleteVisibility: autoCompleteVisibility });
		}
	}
	handleAutoCompleteActive = (type, state) => {
		let { autoCompleteActive } = this.state;
		autoCompleteActive[type] = state;

		this.setState({ autoCompleteActive });
	}

	handleFocus = (type, state) => {
		let { autoCompleteVisibility } = this.state;
		autoCompleteVisibility[type] = state;

		this.setState({ autoCompleteVisibility });

		if (!this.state.formData[type]) {
			this.setState({ provincesData_filtered: this.state.provincesData })
		}
	}

	selectProvince = (province) => {
		if (typeof province != "undefined") {
			if (typeof province.province_id != 'undefined') {
				this.loadCitiesData(null, province.province_id);
			}
		}

		if (typeof province != "undefined") {
			let formData = this.state.formData;
			formData.province = province.name;
			formData.province_id = province.province_id;
			formData.domisili = '';
			formData.city = '';
			formData.city_id = '';

			this.setState({
				autoCompleteVisibility: {
					province: false,
					city: false
				},
			});
		}
	}

	selectCity = (city) => {
		if (typeof city != "undefined") {
			let formData = this.state.formData;
			formData.domisili = city.name;
			formData.city_id = city.city_id;

			this.setState({
				formData: formData,
				autoCompleteVisibility: {
					province: false,
					city: false
				}
			});
		}
	}

	ArrowKeySelectProvince = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if (e.keyCode == '38') {
			if (pointer.province > 0) {
				pointer.province--;
			}

			if (pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}

			this.setState({ pointer });
		} else if (e.keyCode == '40') {
			if (pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if (pointer.province < this.state.provincesData_filtered.length - 1) {
				pointer.province++;
			}
			this.setState({ pointer });
		} else if (e.keyCode == '13') {
			e.preventDefault();
			this.handleAutocompleteBlur('province')
		}

		if (this.state.provincesData_filtered.length && typeof this.state.provincesData_filtered[pointer.province] != "undefined") {
			this.state.formData.province = this.state.provincesData_filtered[pointer.province].name;
			this.state.formData.province_id = this.state.provincesData_filtered[pointer.province].province_id;
		}
	}

	ArrowKeySelectCity = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if (e.keyCode == '38') {
			if (pointer.city > 0) {
				pointer.city--;
			}

			if (pointer.city > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}

			this.setState({ pointer });
		} else if (e.keyCode == '40') {
			if (pointer.city > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if (pointer.city < this.state.citiesData.length - 1) {
				pointer.city++;
			}
			this.setState({ pointer });
		} else if (e.keyCode == '13') {
			e.preventDefault();
			this.handleAutocompleteBlur('city')
		}

		if (this.state.citiesData.length && typeof this.state.citiesData[pointer.province] != "undefined") {
			this.state.formData.city = this.state.citiesData[pointer.city].name;
			this.state.formData.city_id = this.state.citiesData[pointer.city].city_id;
		}
	}

	loadCitiesData = (keyword, province_id) => {
		$.post(API_GET_CITY, { keyword, province_id }).then(
			(data) => {
				this.setState({
					citiesData: data.payload
				});
			}
		)
	}

	loadProvincesData = () => {
		$.getJSON(API_GET_PROVINCE).then(
			(data) => {
				this.setState({
					provincesData: data.payload
				})
			}
		);
	}

	loadProvincesData_filtered = (keyword) => {
		let result = this.state.provincesData.filter(province => province.name.toLowerCase().includes(keyword.toLowerCase()));

		this.setState({ provincesData_filtered: result })
	}

	loadEducationsData = () => {
		$.getJSON(API_GET_EDUCATION).then(
			(data) => {
				this.setState({
					educationsData: data.payload
				})
			}
		);
	}

	handleLoadData = () => {
		this.loadEducationsData();
		this.loadProvincesData();
	};

	componentDidMount() {
		this.handleLoadData();
	}

	render() {
		let {
			fullname,
			countryCode,
			phoneNumber,
			email,
			password,
			dateOfBirth,
			gender,
			study,
			domisili,
			province,
			confirmPassword
		} = this.state.formData;
		let {
			errorFullname,
			errorPhoneNumber,
			errorEmail,
			errorDateOfBirth,
			errorGender,
			errorStudy,
			errorDomisili,
			errorProvince,
			errorPassword,
			errorConfirmPassword
		} = this.state.formErrors;
		let { isPasswordHidden, isConfirmPasswordHidden } = this.state;

		return (
			<div>
				<div className="pt-m mb-xl">
					<form
						id="form-register"
						onSubmit={this.handleSubmit}
						className="form-auth bg-white"
					>
						<div className="px-l py-m inline-block full-width">
							<div className="mb-s">
								<div className="font-largest font-heavy mt-0 mb-xss">
									Daftar GeTI Online
								</div>
								<span>
									Buat akun GeTI Online kamu untuk menikmati modul-modul dan
									event menarik!<br />

									<span className="font-orange-red bold">Bagi Anda peserta Kartu Prakerja, pastikan penulisan nama sudah benar dan sesuai dengan nama di Akun Prakerja, agar sertifikat tidak ditolak PMO!</span>
								</span>
							</div>

							<div className="input-field">
								<input
									name="fullname"
									type="text"
									placeholder="Nama Lengkap Sesuai KTP"
									onChange={this.handleChange}
									value={fullname}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorFullname}
								</div>
							</div>

							<div className="input-field">
								<input
									name="email"
									type="email"
									placeholder="Email"
									onChange={this.handleChange}
									value={email}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorEmail}
								</div>
							</div>

							<div className="input-field row">
								<input
									name="phoneNumber"
									type="tel"
									placeholder="Nomor Telepon"
									className="col s12"
									onChange={this.handleChange}
									value={phoneNumber}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorPhoneNumber}
								</div>
							</div>

							<div className="input-field">
								<input
									name="dateOfBirth"
									type={this.state.dateFormType}
									placeholder="Tanggal Lahir"
									className="col s12"
									onChange={this.handleChange}
									onFocus={() => this.handleDateForm(true)}
									onBlur={() => this.handleDateForm(false)}
									value={dateOfBirth}
									max="2900-01-01"
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorDateOfBirth}
								</div>
							</div>

							<div className="input-field">
								<select
									name="study"
									className={"drop-down " + this.state.formStudyTextColor}
									value={study}
									onChange={this.handleChange}
								>
									<option value="" disabled>Pilih Pendidikan</option>
									{
										this.state.educationsData.map((item) =>
										(
											<option value={item}>{item}</option>
										))
									}
								</select>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorStudy}
								</div>
							</div>

							<div className="input-field">
								<select
									name="gender"
									className={"drop-down " + this.state.formGenderTextColor}
									value={gender}
									onChange={this.handleChange}
								>
									<option value="" disabled>Pilih Jenis Kelamin</option>
									<option value="L">Laki-laki</option>
									<option value="P">Perempuan</option>
								</select>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorGender}
								</div>
							</div>

							<div className="input-field autocomplete-form">
								<input
									name="provinsi"
									type="text"
									placeholder="Provinsi"
									onChange={this.handleChange}
									onBlur={() => this.handleAutocompleteBlur('province')}
									onFocus={() => this.handleFocus('province', true)}
									onKeyDown={this.ArrowKeySelectProvince}
									value={province}
									className="autocomplete-form"
									autoComplete="off"
									disabled={this.state.provincesData.length ? false : true}
								/>
								<div className={(this.state.autoCompleteVisibility.province == true ? '' : 'autocomplete-none') + " autocomplete-container"}>
									<ul className="autocomplete-list" onMouseEnter={() => this.handleAutoCompleteActive('province', true)} onMouseLeave={() => this.handleAutoCompleteActive('province', false)}>
										{
											this.state.provincesData_filtered.map((item, index) =>
											(
												<li className={"autocomplete-item" + (index == this.state.pointer.province ? ' active' : '')} onClick={() => this.selectProvince(item)}>{item.name}</li>
											))
										}
									</ul>
								</div>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorProvince}
								</div>
							</div>

							<div className="input-field autocomplete-form">
								<input
									name="domisili"
									type="text"
									placeholder="Domisili"
									onChange={this.handleChange}
									onBlur={() => this.handleAutocompleteBlur('city')}
									onKeyDown={this.ArrowKeySelectCity}
									value={domisili}
									className="autocomplete-form"
									onFocus={() => this.handleFocus('city', true)}
									autoComplete="off"
									disabled={this.state.formData.province_id && this.state.citiesData.length ? false : true}
								/>
								<div className={(this.state.autoCompleteVisibility.city == true ? '' : 'autocomplete-none') + " autocomplete-container"}>
									<ul className="autocomplete-list" onMouseEnter={() => this.handleAutoCompleteActive('city', true)} onMouseLeave={() => this.handleAutoCompleteActive('city', false)}>
										{
											this.state.citiesData.map((item, index) =>
											(
												<li className={"autocomplete-item" + (index == this.state.pointer.city ? ' active' : '')} onClick={() => this.selectCity(item)}>{item.name}</li>
											))
										}
									</ul>
								</div>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{errorDomisili}
								</div>
							</div>

							<div className="input-field">
								<input
									name="password"
									placeholder="Buat Password"
									type={isPasswordHidden ? "password" : "text"}
									onChange={this.handleChange}
									value={password}
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
									type={isConfirmPasswordHidden ? "password" : "text"}
									onChange={this.handleChange}
									value={confirmPassword}
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
								<button className="btn full mb-s modal-trigger">Daftar</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Register;
