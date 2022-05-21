import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	CheckAuth,
	API_DETAIL_PROFILE,
    API_CHANGE_PASSWORD,
	 API_PASSWORD_FORGET
} from "../Util";
import {
	Row,
	Col,
	Icon,
	Modal,
	Button,
} from "react-materialize";
import { notify } from "react-notify-toast";
import "../../styles/personal-data.css";
import "../../styles/register.css";

class ChangePassword extends Page {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
            formData: {
                old_password: '',
                new_password: '',
                password_confirmation: ''
            },
            formErrors: {
                old_password: '',
                new_password: '',
                password_confirmation: ''
            }
		};

		this.regexPassword = RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).*$/);
	}

	componentDidMount() {
		this.handleLoadData();
	}

	handleLoadData = () => {
		$.post(API_DETAIL_PROFILE).then(data => {
			this.setState({ data: data.payload.data[0] });
		});
	};

	handleResetPassword = (e) => {
		// e.preventDefault();
		let {email} = this.state.data
		$.post(API_PASSWORD_FORGET, {"email" : email}).then((data)=> {
			if (data.status === 'success') {
				//dataForgotPassword = Object.assign({}, dataForgotPassword, data.payload);
				//this.handleSendOTP(params, dataForgotPassword);
				notify.show("Silakan cek email Anda untuk mereset password", "success");
			 } else {
				notify.show("Terjadi kesalahan: " + data.message, "warning");
			 }
		})
	}

    handleChange = e => {
		let { value, name } = e.target;
		let { formData } = this.state;

        formData[name] = value;

		this.setState({ formData });
	};

    checkIsFormValid = () => {
		let { old_password, new_password, password_confirmation } = this.state.formData;
		let { formErrors } = this.state;
		let isValid = true;

		// Old Password Validation
		if (!old_password) {
			formErrors.old_password = "Password tidak boleh kosong";
		} else if (old_password.length < 6) {
			formErrors.old_password = "Minimal password 6 karakter";
		} else {
			formErrors.old_password = "";
		}

        // New Password Validation
		if (!new_password) {
			formErrors.new_password = "Password tidak boleh kosong";
		} else if (new_password.length < 6) {
			formErrors.new_password = "Minimal password 6 karakter";
		} else if (!this.regexPassword.test(new_password)) {
			formErrors.new_password = "Password harus mengandung huruf dan angka";
		} else {
			formErrors.new_password = "";
            formErrors.password_confirmation =
                new_password !== password_confirmation
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

    handleSubmit = async e => {
		e.preventDefault();

		if (this.checkIsFormValid()) {
			let formData = this.state.formData;

			let saved = formData.password_confirmation;

			delete formData.password_confirmation;

			this.state.formData.password_confirmation = saved; 

			this.handleUpdate(formData);
		}
	};

    resetForm = () => {
        this.setState({
            formData: {
                old_password: '',
                new_password: '',
                password_confirmation: ''
            },
            formErrors: {
                old_password: '',
                new_password: '',
                password_confirmation: ''
            }
        })
    }
    
    handleUpdate = (formData) => {
		let dataTemp = {
			client_token: this.clientToken,
			device_token: ""
		};

		formData = Object.assign({}, formData, dataTemp);

		$.post(API_CHANGE_PASSWORD, formData)
			.then(data => {
				if (data.payload) {
					notify.show(
						"Password berhasil diubah",
						"success"
					);

					this.resetForm();
				} else {
					notify.show("Terdapat kesalahan, silakan coba lagi", "warning");
				}
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				let response;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) {}

				if (response && response.status) {
						notify.show(response.message, "warning");
				}
			});
	};

	render() {
        var { data, formErrors, formData } = this.state;

		if (!data) {
			return super.render();
		}

		return (
			<div>
                {/* profile header */}
				<div className="bg-academia font-white">
					<div className="container pad-m pad-l">
						<Row className="mb-0">
							<Col>
								<img src={CheckAuth().foto} className="small circle mr-s" />
							</Col>
							<Col l={6} m={6} s={6}>
								<div className="profile-info">
									<h5 className="font-white">{data.name}</h5>
									<div className="left">{data.email}</div>
								</div>
							</Col>
						</Row>
					</div>
				</div>
					{
						data.is_google == 0  ? 
							<div className="bg-white no-shadow container pad-m">
								<Row>
										<Col s={12} m={12} l={12}>
											<h5>Ubah Password</h5>
										</Col>
								</Row>
								<hr />
								<div>
									<Row>
										<Col s={3} m={2} l={2}>
											<p>Password Lama</p>
										</Col>
										<Col s={9} m={5} l={5} className="list-data">
											<input
													name="old_password"
													placeholder="Password Lama"
													type="password"
													onChange={this.handleChange}
													value={formData.old_password}
											/>
											<div className="helper-text font-orange-red inline-block font-tiny">
													{ formErrors.old_password }
											</div>
										</Col>
									</Row>
									<Row>
										<Col s={3} m={2} l={2}>
											<p>Password Baru</p>
										</Col>
										<Col s={9} m={5} l={5} className="list-data">
											<input
													name="new_password"
													placeholder="Password Baru"
													type="password"
													onChange={this.handleChange}
													value={formData.new_password}
											/>
											<div className="helper-text font-orange-red inline-block font-tiny">
													{ formErrors.new_password }
											</div>
										</Col>
									</Row>
									<Row>
										<Col s={3} m={2} l={2}>
											<p>Konfirmasi Password Baru</p>
										</Col>
										<Col s={9} m={5} l={5} className="list-data">
											<input
													name="password_confirmation"
													placeholder="Konfirmasi Password Baru"
													type="password"
													onChange={this.handleChange}
													value={formData.password_confirmation}
											/>
											<div className="helper-text font-orange-red inline-block font-tiny">
													{ formErrors.password_confirmation }
											</div>
										</Col>
									</Row>
									<Row className="mt-m">
										<Col s={2} m={2} l={2}>
											<Button className="btn-small" onClick={this.handleSubmit}>
													Simpan
											</Button>
										</Col>
									</Row>
								</div>
							</div>
						:
							<div className="pt-m mb-m">
								<div  className="bg-white form-auth px-l pad-xl">
										<h4>Anda Belum Punya Password</h4>
										<p>
											Dikarenakan sebelumnya anda register dengan menggunakan <br/>
											google. Klik button di bawah untuk membuat password Anda.
										</p>
										<input value={data.email} style={{ width: '350px',  fontSize:"18px"}} placeholder="Email anda" disabled />
										<Button onClick={() => {this.handleResetPassword()}}>Kirim Email untuk Reset Password</Button>
								</div>
							</div>
					}
			</div>
		);
	}
}

export default ChangePassword;
