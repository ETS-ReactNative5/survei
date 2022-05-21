import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	BASE_URL,
	API_TRANSACTION_HISTORY,
	FormatPrice,
	ReadableHijri
} from "../Util";
import { Row, Col, Input } from "react-materialize";
import { Link } from "react-router-dom";
import Image from "../Image";
import TransactionConstants from "./Constants";
import { trans } from "../Lang";
import { filter_black, no_result } from "../../assets";
import { ScrollingModal } from "../Reuseables/MiniComponents";
import { EmptyStateDiv } from "../Mentor/MentorList";
import "../../styles/transactions-list.css";

const METHOD_NOT_FOUND =
	"Belum ada transaksi anda yang menggunakkan metode ini";

class Transaction extends Page {
	static LIMIT = 20;

	static PAYMENT_METHODS = {
		0: "Deposit",
		1: "Kupon Extra",
		2: "Kupon",
		3: "PUT (Poin Unit Treni)",
		4: "Komunitas",
		11: "Kupon Utama"
	};

	static PAYMENT_STATUS = {
		"-5": "Menunggu Pembayaran",
		"-4": "Menunggu Konfirmasi",
		"-3": "Kadaluwarsa",
		"-2": "Ditolak",
		"0": "Berhasil"
	};

	static PAYMENT_STATUS_RADIOS = [
		{ label: "Semua", value: "" },
		{ label: "Menunggu Pembayaran", value: "-5" },
		{ label: "Menunggu Konfirmasi", value: "-4" },
		{ label: "Kadaluwarsa", value: "-3" },
		{ label: "Ditolak", value: "-2" },
		{ label: "Berhasil", value: "0" }
	];

	constructor(props) {
		super(props);
		this.state = {
			data: "",
			payment_type: "",
			paymentStatus: ""
		};
	}

	componentDidMount() {
		this.handleLoadData();
		this.updateDimensions();
	}

	updateDimensions = () => {
		this.setState({ width: $(window).width(), height: $(window).height() });
	};

	handleLoadData = () => {
		$.getJSON(API_TRANSACTION_HISTORY).then(data => {
			console.log("TRANSACTION HISTORY DATA >>> ", data);
			this.setState({ data: data.payload });
		});
	};

	recordSearch = () => {
		const { paymentStatus, data } = this.state;

		if (paymentStatus) {
			const results = data.filter(
				element => String(element.status) === paymentStatus
			);
			return !results.length ? "" : results;
		}
		return data;
	};

	render() {
		let { data, paymentStatus } = this.state;

		console.log("DATA >>> ", data);
		const filter_trigger = (
			<div className="pad-m valign-wrapper full-width-filter-button">
				<div className="left">
					<img src={filter_black} />
				</div>
				<div className="right">
					{paymentStatus ? Transaction.PAYMENT_STATUS[paymentStatus] : "Semua"}
				</div>
				<i className="material-icons">chevron_right</i>
			</div>
		);
		const modal_content = (
			<div>
				<h5>Filter</h5>
				<br />
				{Transaction.PAYMENT_STATUS_RADIOS.map(radio => (
					<div className="radio-button-div">
						<Input
							type="radio"
							label={radio.label}
							value={radio.value}
							checked={data && radio.value === paymentStatus}
							onChange={e => {
								this.setState({ paymentStatus: radio.value });
								$(".scrolling-modal-close").click();
							}}
						/>
					</div>
				))}
			</div>
		);

		if (!data) {
			return super.render();
		}

		return (
			<div>
				<div className="bg-maroon pad-l">
					<div className="container-medium pad-m-s">
						<h4 className="font-light font-white mb-0">
							Riwayat Transaksi Anda
						</h4>
					</div>
				</div>

				<div className="bg-white">
					<div className="container-medium">
						<Row>
							<Col l={3} m={3} id="trx-filter-desktop">
								<div id="filter-contents">{modal_content}</div>
							</Col>
							<Col l={9} m={9} s={12}>
								<ScrollingModal
									trigger={filter_trigger}
									contents={modal_content}
									id="trx-filter-modal"
								/>
								{data &&
									this.recordSearch() &&
									this.recordSearch().map((transaction, i) => (
										<TransactionItem data={transaction} />
									))}
								{data && !this.recordSearch() && (
									<EmptyStateDiv
										empty_state_image={no_result}
										title={"Data Tidak Ditemukan"}
										text={METHOD_NOT_FOUND}
										class_name="trx-not-found"
									/>
								)}
								{!data.length && (
									<div className="pad-xl center">
										<img src={BASE_URL + "/img/profile/ic-riwayat.png"} />
										<br />
										<br />
										<div className="strong font-grey">
											Belum ada riwayat transaksi
										</div>
									</div>
								)}
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}

class TransactionItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0
		};
	}
	componentDidMount() {
		this.updateDimensions();
	}

	updateDimensions = () => {
		this.setState({ width: $(window).width(), height: $(window).height() });
	};

	transactionTypeConverter = transaction_type => {
		if (transaction_type == TransactionConstants.DEPOSIT) {
			return "Saldo Paytren";
		} else if (transaction_type == TransactionConstants.VOUCHER) {
			return "Kupon Extra";
		} else if (transaction_type == TransactionConstants.COUPON) {
			return "Redeem Kupon";
		} else if (transaction_type == TransactionConstants.PUT) {
			return "PUT(Poin Unit Treni)";
		} else if (transaction_type == TransactionConstants.COMMUNITY) {
			return "Komunitas";
		} else if (transaction_type == TransactionConstants.MAIN_VOUCHER) {
			return "Kupon Utama";
		}
	};
	render() {
		let data = this.props.data;
		let itemLabel = "";
		let itemStatus = "";
		let uuid = data.purchasable_uuid;
		let priceLabel = data.payment_amount
			? FormatPrice(data.payment_amount)
			: "FREE";

		const moment_hijri = require("moment-hijri");
		if (data.purchasable_type === TransactionConstants.TYPE_COURSE) {
			itemLabel = trans.course;
		} else if (data.purchasable_type === TransactionConstants.TYPE_EVENT) {
			itemLabel = "Event";
		} else if (data.purchasable_type === TransactionConstants.TYPE_COUPON) {
			itemLabel = "Kupon";
		} else if (
			data.purchasable_type === TransactionConstants.TYPE_LEARNING_PATH
		) {
			itemLabel = "Syllabus";
		}

		if (data.status === TransactionConstants.STATUS_PENDING) {
			itemStatus = <h6 className="amber-text">Pending</h6>;
		} else if (data.status === TransactionConstants.STATUS_CONFIRMED) {
			itemStatus = <h6 className="blue-text">Confirmed</h6>;
		} else if (data.status === TransactionConstants.STATUS_EXPIRED) {
			itemStatus = <h6 className="red-text">Expired</h6>;
		} else if (data.status === TransactionConstants.STATUS_REJECTED) {
			itemStatus = <h6 className="red-text">Rejected</h6>;
		} else if (data.status === TransactionConstants.STATUS_VERIFIED) {
			itemStatus = <h6 className="green-text">Verified</h6>;
		} else {
			itemStatus = <h6 className="brown-text">Undefined</h6>;
		}

		if (data.payment_method == TransactionConstants.PUT) {
			priceLabel = data.payment_amount + " PUT";
		} else if (data.payment_method == TransactionConstants.COUPON) {
			priceLabel = data.coupon_code;
		}

		const hijri_date = target_date => {
			return moment_hijri(target_date);
		};

		return (
			<Link to={`/transactions/${data.invoice_number}`}>
				<div className="hoverable pad-m section-card border-bottom">
					<span className="transaction-date font-grey">
						<b>{hijri_date(data.created_at).format("DD MMM YYYY, hh:mm")}</b>
					</span>
					<div>
						<Image
							src={data.purchasable_image}
							className="square trx-item-image"
						/>
						<div className="content trx-item">
							<Row>
								<Col l={6} m={6} s={6}>
									<span className="transaction-labels item-label">
										{itemLabel}
									</span>
									<h5>{data.purchasable_title}</h5>
								</Col>
								<Col l={6} m={6} s={6} className="transaction-payment-info">
									{itemStatus}
									<span className="transaction-labels payment-label">
										{this.transactionTypeConverter(data.payment_method)}
									</span>
									<h5 className="price-label">{priceLabel}</h5>
								</Col>
							</Row>
						</div>
					</div>
					{/*<div className="strong mb-s font-grey">Invoice Number : {data.invoice_number}</div>*/}
				</div>
			</Link>
		);
	}
}

export default Transaction;
