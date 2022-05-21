import React from "react";
import store from "store";
import $ from "jquery";
import { EventDetail, EventCourse } from "./Detail";
import {
	QueryParam,
	API_EVENT_BASE_URL,
	API_PAYMENT,
	API_USER,
	FormatPrice,
	CheckAuth,
	FormatDateIndo,
	FormatTime,
	sleep,
	BASE_URL
} from "../Util";
import {
	Row,
	Col,
	ProgressBar,
	Input,
	Tabs,
	Tab,
	Button,
	Modal,
	Table
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import GoogleMapReact from "google-map-react";
import Sticky from "react-sticky-el";
import { trans } from "../Lang";
import RadioGroup from "../Reuseables/RadioGroup";
import PinInput from "react-pin-input";
import TransactionConstants from "../Transaction/Constants";
import PaymentModal from "../Payment/Modal";

class EventOrder extends EventDetail {
	constructor(props) {
		super(props);
		this.state.participants = [{}];
		this.state.valid = false;
		this.state.payment_confirmed = false;
		this.state.payment_method = TransactionConstants.DEPOSIT;
		this.state.typed_code = "";

		let user = CheckAuth();

		this.state.cp_name = user.nama;
		this.state.cp_email = user.email;
		this.state.cp_phone = user.phone;

		super.checkLogin(props);
	}

	setUserAsParticipant = e => {
		let participants = this.state.participants;
		let user = CheckAuth();

		console.log("PARTICIPANTS >>> ", participants);
		console.log("CHECK AUTH >>> ", user);

		if (e.target.checked) {
			let userData = { phone: user.phone, name: user.nama, error: "" };

			if (participants.length === 1) {
				if (participants[0].name || participants[0].phone) {
					if (
						participants[0].name === user.nama ||
						participants[0].phone === user.phone
					) {
						participants[0] = userData;
					} else {
						participants.unshift(userData);
					}
				} else {
					participants[0] = userData;
				}
			} else {
				if (participants[0].name || participants[0].phone) {
					participants.unshift(userData);
				} else {
					participants[0] = userData;
				}
			}
			console.log("USER DATA >>> ", userData);
			console.log("PARTICIPANTS >>> ", participants);

			this.setState({ participants: participants });

			$("#name")
				.next()
				.toggleClass("active", e.target.checked);

			// this.validateUser(0, userData, participants);
		} else {
			participants[0] = { phone: "", name: "", error: "" };
			this.setState({ participants: participants });
		}
	};

	addParticipant = (e, user) => {
		let participants = this.state.participants;

		participants.push({
			phone: user ? user.phone : "",
			name: user ? user.name : "",
			error: ""
		});

		this.setState({ participants: participants });
	};

	deleteParticipant = (index, e) => {
		this.setState({
			participants: this.state.participants.filter((_, i) => i !== index)
		});
	};

	updateParticipant = (index, e) => {
		let participants = this.state.participants;
		let field = e.target.id;

		participants[index][field] = e.target.value;

		this.setState({ participants: participants });
	};

	onClickPaymentButton = e => {
		console.log("ONCLICK PAYMENT BUTTON");
		this.setState({
			payment_confirmed: true,
			payment_method: store.get("event_payment_method")
		});
	};

	togglePaymentPopup = e => {
		e.preventDefault();

		let participants = this.state.participants;

		for (let p in participants) {
			console.log("PAYMENT POPUP P >>> ", participants[p]);
			if (participants[p].error) {
				return;
			}
		}

		// $("#btn-pay").trigger("click");
		console.log("MASUK GAN");
	};

	isCpParticipant = () => {
		let phone = CheckAuth().phone;
		let participantIds = this.state.participants.map(
			participant => participant.phone
		);

		return (
			participantIds.filter(
				item => phone && item && phone.toUpperCase() === item.toUpperCase()
			).length > 0
		);
	};

	validateUser = (index, e, participants) => {
		let phone = e.phone ? e.phone : e.target.value;
		if (!participants) {
			participants = this.state.participants;
		}

		console.log("VALIDATE - USER PHONE >>> ", phone);

		if (!phone) {
			return;
		}

		let existPhones = participants.map(participant => participant.phone);
		console.log("VALIDATE - EXIST PHONES >>> ", existPhones);

		if (
			existPhones.filter(item => {
				phone && item && phone.toUpperCase() === item.toUpperCase();
			}).length > 1
		) {
			participants[index]["error"] = "User yang sama sudah diinput";
		} else {
			participants[index]["error"] = "";
			$.post(
				API_EVENT_BASE_URL + "/" + this.state.uuid + "/validate_participant",
				{ phone: phone }
			)
				.then(data => {
					if (data.status === "success") {
						console.log("VALIDATE - SUCCESS >>> ", data);
						participants[index]["name"] = data.payload.name;
						participants[index]["error"] = null;
						this.setState({ participants: participants });
					}
				})
				.fail((XMLHttpRequest, textStatus, errorThrown) => {
					var response = null;
					var status = XMLHttpRequest.status;

					try {
						response = JSON.parse(XMLHttpRequest.responseText);
					} catch (err) {}

					console.log("VALIDATE - FAILED >>> ", response.payload);

					if (status == 400) {
						let currentParticipants = this.state.participants;

						if (currentParticipants.length == participants.length) {
							participants[index]["error"] = response.payload;
							this.setState({ participants: participants });
						}
					}
				});
		}

		this.setState({ participants: participants });
	};

	handleSubmitData = e => {
		e.preventDefault();
		let { data, participants } = this.state;
		let itemType = "event";
		let itemData = {
			item_data: {
				contact_person: {
					paytren_id: $("#cp_idpaytren").val(),
					name: $("#cp_name").val(),
					phone: $("#cp_phone").val(),
					email: $("#cp_email").val()
				},
				participants: participants.map(p => ({
					paytren_id: p.idpaytren,
					name: p.name,
					phone: p.phone
				}))
			}
		};

		data = Object.assign(data, itemData);

		console.log("SUBMIT EVENT TYPE >>>", itemType);
		console.log("SUBMIT EVENT ITEM DATA >>>", itemData);
		console.log("SUBMIT EVENT EVENT DATA AND ITEM DATA >>>", data);
		console.log("SUBMIT EVENT PARTICIPANTS >>>", participants);

		if (CheckAuth()) {
			this.props.history.push("/payment", { data, itemType });
		} else {
			this.props.history.push("/login");
		}
	};

	handlePinChange = e => {
		var errorMessage = "";
		var pinPattern = /^\d{6}$/;

		if (!pinPattern.test(e.target.value)) {
			errorMessage = "PIN harus terdiri dari 6 digit angka";
		}

		this.setState({ errorMessage: errorMessage });
	};

	handleTypePin = event => {
		var charCode = parseInt(event.charCode);
		if (charCode != 13 && (charCode < 48 || charCode > 57)) {
			event.preventDefault();
		}
	};

	pinInputBox() {
		return (
			<PinInput
				length={6}
				focus
				secret
				type="numeric"
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "1rem"
				}}
				inputStyle={{
					borderRadius: "8px",
					borderColor: "#e0e0e0",
					backgroundColor: "#e0e0e0"
				}}
				onChange={this.handlePinChange}
			/>
		);
	}

	getPaymentConfirmationScreen(payment_method) {
		const method = parseInt(payment_method);
		console.log(method);
		if (
			method === TransactionConstants.DEPOSIT ||
			method === TransactionConstants.PUT
		) {
			console.log(payment_method);
			return (
				<div className="payment-code-input">
					<h5>Masukkan Kode Bayar</h5>
					{this.pinInputBox()}
				</div>
			);
		} else {
			return (
				<div>
					<h5>Konfirmasi Pembayaran</h5>
					<span>
						Apa kamu yakin membeli modul ini dengan menggunakan Kupon Belajar?
					</span>
				</div>
			);
		}
	}

	getPaymentInfoScreen = (event_detail, participants) => {
		return (
			<Row>
				<Col s={6}>
					<img
						className="left"
						src={BASE_URL + "/img/white-label/logo/logo-horizontal.png"}
						style={{ width: "80px" }}
					/>
				</Col>
				<Col s={6}>
					<h5>{event_detail.title}</h5>Oleh : {event_detail.organizer}
				</Col>
				<Col s={12} className="mb-s">
					<Table className="mb-s" bordered>
						<tbody>
							<tr>
								<td>Jenis Tiket</td>
								<td>Jumlah</td>
								<td>Total Biaya</td>
							</tr>
							<tr className="font-orange h5">
								<td>
									{this.isEarly(event_detail) ? "Early Bird" : "Harga Normal"}
								</td>
								<td>{participants.length}</td>
								<td>
									{FormatPrice(
										this.getPrice(event_detail) * participants.length
									)}
								</td>
							</tr>
						</tbody>
					</Table>
					<h6>Metode Pembayaran</h6>
					<br />
					<RadioGroup
						name="event_payment_method"
						options={[
							{
								value: TransactionConstants.DEPOSIT,
								label: "Bayar dengan Saldo"
							},
							{ value: TransactionConstants.PUT, label: "Bayar dengan PUT" },
							{
								value: TransactionConstants.MAIN_VOUCHER,
								label: "Bayar dengan Poin Utama"
							}
						]}
						required={true}
					/>
				</Col>
			</Row>
		);
	};

	render() {
		var data = this.state.data;
		if (!data) {
			return super.render();
		}

		let heldAt = FormatDateIndo(data.held_at, false, false, true);
		let user = CheckAuth();
		let {
			payment_confirmed,
			participants,
			typed_code,
			payment_method
		} = this.state;
		const isUsingVoucher = payment_method === "1" || payment_method === "11";
		const payment_info_screen = this.getPaymentInfoScreen(data, participants);

		return (
			<Row className="container mt-m">
				<Col className="pad-m" m={5} s={12}>
					<Image className="small left mr-s" src={data.image_url} />
					<h5>{data.title}</h5>
					Oleh {data.organizer}
					<br />
					<br />
					{super.getEventInfo(data)}
					{data.bonus_courses.length > 0 && (
						<div>
							<h5>Bonus {trans.course_item}</h5>
							<hr />
							<EventCourse data={data.bonus_courses} />
						</div>
					)}
					{data.required_courses.length > 0 && (
						<div>
							<h5>Syarat mengikuti Event</h5>
							<hr />
							<EventCourse data={data.required_courses} />
						</div>
					)}
				</Col>
				<Col className="bg-white pad-m" m={7} s={12}>
					<img
						src={BASE_URL + "/img/white-label/logo/logo-horizontal.png"}
						style={{ width: "100px" }}
						className="mb-m"
					/>
					<h5>Data Peserta</h5>
					<div className="mb-m">
						Harap isi data pemesan dengan data yang valid sesuai kartu identitas
					</div>

					<h5>Pemesan</h5>
					<form onSubmit={this.handleSubmitData}>
						<Row className="form-bordereds">
							<Input
								onChange={this.handleInputChange}
								required
								value={user.phone}
								className="mb-m"
								id="cp_phone"
								s={12}
								label="No Telepon"
								disabled
							/>
							<Input
								onChange={this.handleInputChange}
								required
								defaultValue={user.nama}
								id="cp_name"
								s={12}
								label="Nama"
								disabled
							/>
							<Input
								onChange={this.handleInputChange}
								required
								defaultValue={user.email}
								id="cp_email"
								s={12}
								label="Email"
							/>

							<Input
								onChange={this.setUserAsParticipant.bind(this)}
								id="cp_participant"
								type="checkbox"
								label="Saya peserta event"
								checked={this.isCpParticipant()}
							/>
						</Row>
						<hr className="mtb-m" />
						<Row>
							<Col l={6} m={6} s={6}>
								<h5 className="mb-s">Data Peserta</h5>
							</Col>
							<Col l={6} m={6} s={6}>
								<a
									onClick={this.addParticipant.bind(this)}
									className="font-orange mb-s right"
								>
									+ Tambah Peserta
								</a>
							</Col>
						</Row>

						{participants &&
							participants.map((participant, key) => (
								<Row className="form-bordereds mb-s mt-s">
									<Col className="strong mb-xs" s={12}>
										Peserta {key + 1}
										{participants.length > 1 && (
											<a
												onClick={this.deleteParticipant.bind(this, key)}
												className="font-orange right"
											>
												Hapus
											</a>
										)}
									</Col>
									<Input
										value={
											participants[key]["name"] ? participants[key]["name"] : ""
										}
										onChange={this.updateParticipant.bind(this, key)}
										id="name"
										s={12}
										label="Nama"
										required
									/>
									<Input
										// onBlur={this.validateUser.bind(this, key)}
										value={
											participants[key]["phone"]
												? participants[key]["phone"]
												: ""
										}
										onChange={this.updateParticipant.bind(this, key)}
										id="phone"
										s={12}
										label="Nomer Telepon"
										required
									/>
									<Col s={12} className="font-red error">
										{participants[key]["error"]}
									</Col>
								</Row>
							))}
						<Input
							type="submit"
							value="Bayar"
							className="btn capitalize full"
							s={12}
						/>
					</form>

					<Modal
						header={
							<span className="valign-wrapper">
								{payment_confirmed && (
									<i
										className="material-icons modal-back-btn"
										onClick={() => this.setState({ payment_confirmed: false })}
									>
										arrow_back
									</i>
								)}
								Bayar Tiket
							</span>
						}
						trigger={<Button id="btn-pay" className="hide" />}
					>
						<hr />
						{!payment_confirmed && payment_info_screen}
						{payment_confirmed &&
							this.getPaymentConfirmationScreen(payment_method)}
						{payment_confirmed && isUsingVoucher && (
							<Button
								id="enroll-btn"
								s={12}
								className="left voucher-payment-button voucher-cancel"
								waves="light"
								onClick={() => this.setState({ payment_confirmed: false })}
							>
								Batal
							</Button>
						)}
						<Button
							id="enroll-btn"
							s={12}
							className={
								isUsingVoucher && payment_confirmed
									? "right voucher-payment-button"
									: "full"
							}
							waves="light"
							onClick={!payment_confirmed ? this.onClickPaymentButton : ""}
						>
							{!payment_confirmed
								? "Lanjutkan"
								: data.ticket_price > 0 && !isUsingVoucher
								? "Bayar - " + FormatPrice(data.ticket_price)
								: "Bayar"}
						</Button>
					</Modal>
				</Col>
			</Row>
		);
	}
}
export default EventOrder;
