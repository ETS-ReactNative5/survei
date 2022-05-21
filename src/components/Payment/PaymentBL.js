import React, { Component } from "react";
import $ from "jquery";
import store from "store";
import Page from "../Page";
import { Button } from "react-materialize";
import {
    API_PAYMENT,
    API_VOUCHER_CHECK,
	API_VOUCHER,
	FormatPrice,
	CheckAuth,
	scrollToTop
} from "../Util";
import { notify } from "react-notify-toast";
import TransactionConstants from "../Transaction/Constants";
import "../../styles/new-style.css";

class PaymentBL extends Page {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			itemType: "",
            inputVoucher: "",
            inputEmail: "",
			voucherData: "",
			participantData: ""
		};
	}

	// componentDidMount = () => {
	// 	let locationState = this.props.location.state;

	// 	if (locationState && CheckAuth()) {
	// 		if (locationState.itemType) {
	// 			// If event, check participant length
	// 			if (locationState.itemType == "event") {
	// 				let participantLength =
	// 					locationState.data.item_data.participants.length;
	// 				locationState.data.title += " x " + participantLength;
	// 				locationState.data.price *= participantLength;
	// 			}

	// 			this.setState(
	// 				{
	// 					data: locationState.data,
	// 					itemType: locationState.itemType,
	// 					participantData: locationState.data.item_data
	// 						? locationState.data.item_data.participants
	// 						: ""
	// 				},
	// 				() => {
	// 					console.log("DATA >>> ", this.state.data);
	// 					console.log("ITEM TYPE >>> ", this.state.itemType);
	// 				}
	// 			);
	// 		} else {
	// 			notify.show("Item type tidak ditemukan", "warning");
	// 		}
	// 	} else {
	// 		this.props.history.goBack();
	// 	}

	// 	scrollToTop();
	// };

	handleChangeVoucher = e => {
		let { value } = e.target;
		value = value.toUpperCase();
		console.log("ON CHANGE VOUCHER VALUE >>> ", value);
		this.setState({ inputVoucher: value });
    };

	handleChangeEmail = e => {
		let { value } = e.target;
		// value = value.toUpperCase();
		console.log("ON CHANGE EMAIL VALUE >>> ", value);
		this.setState({ inputEmail: value });
	};

	handleCancelVoucher = e => {
		e.preventDefault();
		let { voucherData } = this.state;
		notify.show("Voucher " + voucherData.code + " dibatalkan", "warning");
		this.setState({ voucherData: "" });
	};

	handleSubmitVoucher = e => {
		e.preventDefault();
		let { inputVoucher } = this.state;

		$.get(API_VOUCHER_CHECK + "/" + inputVoucher)
			.then(data => {
				console.log("handleSubmitVoucher >>> ", data);
				this.setState({ voucherData: data.payload });
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				var response = null;
				var status = XMLHttpRequest.status;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) {}

				if (response && response.status) {
					if (response && response.message) {
						notify.show(response.message, "warning");
						this.setState({ errorMessage: response.message });
					} else if (status == 400 || status == 403) {
						this.setState({ errorMessage: response.message });
					} else {
						this.setState({ errorMessage: response.status });
					}
				}
			});
	};

	handleBuy = e => {
		e.preventDefault();
		let { itemType, data, voucherData, participantData } = this.state;
		let itemData = "";
		let voucherCode = voucherData ? voucherData.code : "";

		if (itemType == "event") {
			itemData = JSON.stringify(data.item_data);
		}

		let param = {
			method: TransactionConstants.TRANSFER,
			item_type: itemType,
			item_quantity: participantData.length || 1,
			item_uuid: data.uuid,
			item_data: itemData,
			pin: "000000",
			voucher_code: voucherCode
		};

		// DUMP PARAM
		console.log("ENROLLMENT PARAM >>> ", param);

		$.post(API_PAYMENT, param)
			.then(data => {
				console.log("PAYMENT DATA >>> ", data);
				const { invoice_number } = data.payload;

				this.props.history.push(`/transactions/${invoice_number}`);
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				var response = null;
				var status = XMLHttpRequest.status;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) {}

				if (response && response.status) {
					if (response && response.message) {
						notify.show(response.message, "warning");
						this.setState({ errorMessage: response.message });
					} else if (status == 400 || status == 403) {
						if (this.state.payment_method == TransactionConstants.COUPON) {
							this.setState({ errorMessage: alert.invalid_coupon });
						} else {
							this.setState({ errorMessage: response.message });
						}
					} else {
						this.setState({ errorMessage: response.status });
					}
				}
			});
	};

	render() {
		const { data, inputVoucher, inputEmail, voucherData, itemType } = this.state;

		let finalPrice = data.price;
		let voucherDeduction = 0;
		let voucherMaxAmount = 0;

		if (voucherData) {
			console.log("Voucher Data >>> ", voucherData);
			voucherMaxAmount = voucherData.max_amount;
			voucherDeduction = finalPrice * (voucherData.discount / 100);
			voucherDeduction =
				voucherDeduction > voucherMaxAmount
					? voucherMaxAmount
					: voucherDeduction;
			finalPrice = finalPrice - voucherDeduction;
		}

		return (
			<div className="container">
				<div className="payment-page">
					<div className="payment-page-top">
						<span className="strong">Konfirmasi Pembayaran</span>
					</div>
					<form autocomplete="off" onSubmit={e => e.preventDefault()}>
						{data.price !== 0 && (
							<section className="payment-input-voucher">
								<form
									className="payment-input-voucher-inner"
									onSubmit={this.handleSubmitVoucher}
                                >
                                    <table>
                                        <tr>
                                            <td>
                                                <input id="kode_voucher" name="kode_voucher"
                                                    placeholder="Kode Voucher"
                                                    value={inputVoucher}
                                                    onChange={this.handleChangeVoucher}
                                                    type="text"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {!voucherData && (
                                                    <Button className="btn btn-pa">Gunakan</Button>
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                </form>
								{voucherData && (
									<div className="payment-voucher-message font-green">
                                        Selamat! Kode voucher anda sudah valid. Silahkan hubungin CS GETI (08119309114) untuk info lebih lanjut.
										<br />
									</div>
								)}
								<br />
							</section>
						)}
					</form>
				</div>
			</div>
		);
	}
}

export default PaymentBL;
