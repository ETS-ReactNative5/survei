/* eslint-disable */

import $ from "jquery";
import React from "react";
import { Button, Input, Modal } from "react-materialize";
import Col from "react-materialize/lib/Col";
import Row from "react-materialize/lib/Row";
import { notify } from "react-notify-toast";
import store from "store";
import "../../styles/rating-modal.css";
import { API_CERTIFICATE } from "../Util";
import FontAwesome from "react-fontawesome";


class ShareToEmailModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				toEmail: "",
				subject: "",
				body: ""
			},
			formErrors: {
				errorToEmail: "",
				errorSubject: "",
				errorBody: ""
			},
			uuid: this.props.reportUid
		};

		this.regexEmail = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

		this.fieldChange = this.fieldChange.bind(this);
		this.handleSubmitForm = this.handleSubmitForm.bind(this);
	}

	componentDidMount() {
		let { is_open, modal_name } = this.props;
		if (is_open) {
			$("#" + modal_name + "_button").trigger("click");
		}
	}

	fieldChange = e => {
		const { name, value } = e.target;
		let { formData } = this.state;
		formData[name] = value;
		this.setState({ formData });
	};

	handleSubmitForm = e => {
		e.preventDefault();
		const api_url = API_CERTIFICATE + this.state.uuid + "/send";
		if (this.validateForm()) {
			let {formData} = this.state;
			let params = {
				to_email: formData.toEmail,
				subject: formData.subject,
				body: formData.body,
			}
			$.post(api_url, params)
				.then(data => {
					notify.show(data.payload, "success");
					console.log('userdata: ', store.get('userdata'));
					this.emptyField();

					$("#closeEmailButton").trigger("click");
				})
				.catch((xhr) => {
					console.log('CATCH SEND: ', xhr);
					notify.show("Terjadi kesalahan: " + xhr.responseJSON.message, "warning");
				});
		}
	};

	emptyField = () => {
		let formData = {
			toEmail: "",
			subject: "",
			body: ""
		};
		let formErrors = {
			errorToEmail: "",
			errorSubject: "",
			errorBody: ""
		};
		this.setState({formData});
		this.setState({formErrors});
	}

	validateForm = () => {
		let { toEmail, subject, body } = this.state.formData;
		let { formErrors } = this.state;
		let isValid = true;

		// Subject
		if (!subject) {
			formErrors.errorSubject = "Subject/Judul tidak boleh kosong";
		} else {
			formErrors.errorSubject = "";
		}
		// Body
		if (!body) {
			formErrors.errorBody = "Isi email tidak boleh kosong";
		} else {
			formErrors.errorBody = "";
		}

		// Email Validation
		if (!toEmail) {
			formErrors.errorToEmail = "Email tidak boleh kosong";
		} else if (!this.regexEmail.test(toEmail)) {
			formErrors.errorToEmail = "Email tujuan yang Anda masukkan tidak valid";
		} else {
			formErrors.errorToEmail = "";
		}

		this.setState({ formErrors });

		// RETURN ISVALID
		Object.values(formErrors).forEach(value => {
			if (value) {
				isValid = false;
			}
		});

		return isValid;
	}

	render() {
		let { toEmail, subject, body } = this.state.formData;
		let { uuid } = this.state;
		let modal_id = "email_" + uuid;

		return (
			<div style={{display: 'inline-block'}}>
				<Modal
					id={modal_id}
					header={"Kirim Sertifikat ke Email"}
					trigger={<Button id={modal_id + "_button"} className="btn btn-circle mr-xs"><FontAwesome name="envelope" /></Button>}
					options={{ dismissible: true }}
				>
					<div id="comment-block">
						<span id="comment-title">
							<h5>Email Tujuan</h5>
						</span>
						<Input
							placeholder={'alamat@email.com'}
							onChange={this.fieldChange}
							name={'toEmail'}
							value={toEmail}
						/>
					</div>
					<div id="comment-block">
						<span id="comment-title">
							<h5>Subjek</h5>
						</span>
						<Input
							placeholder={'Sertifikat Kelulusan'}
							onChange={this.fieldChange}
							name={'subject'}
							value={subject}
						/>
					</div>
					<div id="comment-block">
						<span id="comment-title">
							<h5>Isi Email</h5>
						</span>
						<Input
							type="textarea"
							onChange={this.fieldChange}
							name={'body'}
							value={body}
						/>
					</div>
					<Row style={{margin:0}}>
						<Col s={12} m={6} style={{padding:'0 10px'}}>
							<Button className={'btn-small full-width-buttons'} id="sendEmailButton" onClick={this.handleSubmitForm}>
								Kirim
							</Button>
						</Col>
						<Col s={12} m={6} style={{padding:'0 10px'}}>
							<Button id="closeEmailButton" className={'btn-small btn-outline full-width-buttons'} modal="close">
								Tutup
							</Button>
						</Col>
					</Row>
				</Modal>
			</div>
		);
	}
}

export default ShareToEmailModal;
