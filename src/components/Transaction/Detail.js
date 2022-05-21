import React from "react";
import store from "store";
import $ from "jquery";
import {
	API_TRANSACTION_HISTORY,
	API_BANK_LIST,
	API_PAYMENT,
	BASE_URL,
	scrollToTop,
	FormatDateIndo,
	FormatPrice
} from "../Util";
import { Link } from "react-router-dom";
import { Icon, Button } from "react-materialize";
import { notify } from "react-notify-toast";
import Page from "../Page";
import TransactionConstants from "./Constants";
import TransactionPipe from "./Components/Pipe";

class TransactionDetail extends Page {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			invoiceNumber: props.match.params.invoice_number,
			bankData: "",
			selectedBankUid: "",
			buktiTransferData: "",
			isActiveFormUpload: false,
			uploadedImageData: ""
		};
	}

	componentDidMount() {
		this.handleLoadBankList();
		this.handleLoadData();
	}

	handleLoadData(reload = false) {
		$.getJSON(API_TRANSACTION_HISTORY + "/" + this.state.invoiceNumber).then(
			data => {
				console.log("API TRANSACTION PAYLOAD DATA >>> ", data);

				this.setState({ data: data.payload }, () => {
					if (reload) {
						window.location.reload(true);
					} else {
						scrollToTop();
					}
				});
			}
		);
	}

	handleLoadBankList = () => {
		$.get(API_BANK_LIST, { per_page: 5 }).then(data => {
			console.log("API BANK LIST PAYLOAD DATA >>> ", data);

			this.setState({
				bankData: data.payload,
				selectedBankId: data.payload.length === 1 ? data.payload[0].id : ""
			});
		});
	};

	handleCopy = (type, value = "") => {
		let textArea = document.createElement("textarea");

		if (type == "bank-account") {
			textArea.value = value.split("-").join("");
		} else {
			let input = document.getElementById("totalFixed");
			textArea.value = input.textContent.replace(/[Rp.]/g, "");
		}

		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("Copy");
		textArea.remove();
		notify.show("Teks tersalin", "success", 3000);
	};

	handleChangeBank = e => {
		let { value } = e.target;

		this.setState({
			selectedBankId: value
		});
	};

	handleChangeBuktiTransfer = e => {
		let formData = new FormData($("#form-upload")[0]);
		let file = e.target.files[0];

		if (file.type.indexOf("image") === -1) {
			notify.show("File harus berupa gambar", "warning");
			e.target.value = "";
			return;
		}

		this.setState({
			buktiTransferData: formData,
			uploadedImageData: file
		});
	};

	handleSubmitUpload = e => {
		let { data, buktiTransferData, invoiceNumber, selectedBankId } = this.state;
		let param;

		if (!selectedBankId) {
			notify.show("Bank tidak boleh kosong", "warning");
		} else if (!buktiTransferData) {
			notify.show("Upload bukti transfer Anda", "warning");
		} else {
			param = {
				receipt: buktiTransferData,
				bank_account_id: selectedBankId
			};

			$.ajax({
				url: API_PAYMENT + "/" + invoiceNumber + "/confirm",
				data: buktiTransferData,
				type: "POST",
				contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
				processData: false // NEEDED, DON'T OMIT THIS
			}).then(data => {
				console.log("RESULT SUBMIT DATA >>> ", data);
				this.handleLoadData(true);
			});
		}

		e.preventDefault();
	};

	render() {
		const {
			data,
			bankData,
			selectedBankId,
			isActiveFormUpload,
			buktiTransferData,
			uploadedImageData
		} = this.state;

		let finalPrice = data.payment_amount;
		let splitPrice = "";
		let priceRight = "";
		let priceLeft = "";
		let itemType = data.purchasable_type;

		if (data.deductions) {
			data.deductions.map(deduction => {
				finalPrice -= deduction.amount;
			});
		}

		finalPrice = finalPrice <= 0 ? "GRATIS" : FormatPrice(finalPrice);

		if (finalPrice != "GRATIS") {
			let splitPrice = finalPrice.split(".");
			let priceRight = splitPrice.pop();
			let priceLeft = splitPrice.join(".");
		}

		console.log("UPLOADED IMAGE DATA >>> ", uploadedImageData);
		console.log("BUKTI TRANSFER DATA >>> ", buktiTransferData);
		console.log("SELECTED BANK ID >>> ", selectedBankId);
		console.log("ITEM TYPE >>> ", itemType);

		return (
			<div className="transaction-page container-small">
				<TransactionPipe status={data.status} />

				{// Transaction Payment
				data.status == TransactionConstants.STATUS_PENDING && (
					<section className="transaction-pending transaction-payment">
						<div className="transaction-payment-inner">
							<div className="transaction-section-subtitle center-align">
								Segera Lakukan Pembayaran
							</div>
							<div className="transaction-section-content center-align">
								<div className="content-text-wrapper">
									<span id="totalFixed" className="content-text strong">
										{finalPrice}
										{/* {priceLeft}.<span className="font-red">{priceRight}</span> */}
									</span>
									<a
										className="btn btn-small"
										onClick={() => this.handleCopy()}
									>
										Salin
									</a>
								</div>
								{/* <div className="payment-info align-left">
									<span className="info-icon">
										<img src={BASE_URL + "/img/info.png"} />
									</span>
									<span className="info-message">
										<span className="strong font-red">Penting! </span>
										<span>Mohon transfer tepat sampai 3 angka terakhir</span>
									</span>
								</div> */}
							</div>
						</div>
					</section>
				)
				// End Transaction Payment
				}

				{// Transaction Bank List
				data.status == TransactionConstants.STATUS_PENDING && (
					<section className="transaction-pending transaction-bank-transfer">
						<div className="transaction-section-subtitle center-align">
							Transfer ke salah satu rekening kami
						</div>
						<div className="transaction-section-content">
							{bankData &&
								bankData.map(bank => {
									return (
										<div className="bank-transfer-item">
											<div className="item-left">
												<img
													className="bank-account-image"
													src={bank.logo_url}
												/>
												<div className="bank-account-number strong">
													{bank.account_number}
												</div>
												<div className="bank-account-name">
													(a/n {bank.account_owner})
												</div>
											</div>
											<div className="item-right">
												<a
													className="btn btn-small"
													onClick={() =>
														this.handleCopy("bank-account", bank.account_number)
													}
												>
													Salin
												</a>
											</div>
										</div>
									);
								})}
						</div>
					</section>
				)
				// End Transaction Bank List
				}

				{// Transaction - Menunggu Pembayaran && Kalo sudah melakukan transfer
				((data.receipt_url &&
					data.status != TransactionConstants.STATUS_REJECTED) ||
					data.status == TransactionConstants.STATUS_CONFIRMED) && (
					<section className="transaction-waiting-for-confirmation center">
						<img src={BASE_URL + "/img/asset_time.svg"} />
						<div className="transaction-section-title strong">
							Pembayaran Sedang Diproses
						</div>
						<span>
							Mohon tunggu, kami akan melakukan pengecekan paling lambat 2x24
							jam.
						</span>
					</section>
				)
				// End Transaction - Menunggu Pembayaran
				}

				{// Transaction - Kedaluwarsa -> Kalo belum melakukan transfer
				!data.receipt_url &&
					data.status == TransactionConstants.STATUS_EXPIRED && (
						<section className="transaction-expired center">
							<img
								className="mb-xss"
								src={BASE_URL + "/img/popup_error.svg"}
								style={{ width: "130px" }}
							/>
							<div className="transaction-section-title strong">
								Mohon Maaf, Waktu Pembayaran Anda Sudah Habis
							</div>
						</section>
					)
				// End Transaction - Kedaluwarsa
				}

				{// Transaction - Ditolak
				data.status == TransactionConstants.STATUS_REJECTED && (
					<section className="transaction-expired center">
						<img
							className="mb-xss"
							src={BASE_URL + "/img/popup_error.svg"}
							style={{ width: "130px" }}
						/>
						<div className="transaction-section-title strong">
							Mohon maaf, kami tidak dapat memverifikasi pembayaran Anda
						</div>
					</section>
				)
				// End Transaction - Ditolak
				}

				{// Transaction - Verified
				data.status == TransactionConstants.STATUS_VERIFIED && (
					<section className="transaction-success center">
						<img
							className="mb-xss"
							src={BASE_URL + "/img/popup_berhasil.svg"}
						/>
						<div className="transaction-section-title strong">
							Pembayaran Berhasil
						</div>
						<span>Paket berlangganan Anda telah diaktifkan</span>
					</section>
				)
				// End Transaction - Verified
				}

				{// Transaction - Kedaluwarsa namun sudah upload bukti transfer
				data.receipt_url &&
					data.status != TransactionConstants.STATUS_REJECTED && (
						<section className="transaction-bukti-transfer">
							<div className="transaction-section-title strong">
								Bukti Transfer
							</div>
							<div className="bukti-transfer-bank">
								<span>Transfer ke Bank</span>
								<span className="bukti-transfer-bank-bankname">
									{selectedBankId}
								</span>
							</div>
							<div className="bukti-transfer-image">
								<img src={data.receipt_url} />
							</div>
						</section>
					)
				// End Transaction - Kedaluwarsa namun sudah upload bukti transfer
				}

				{/* Transaction Detail */}
				<section
					className={
						data.status == TransactionConstants.STATUS_PENDING
							? "transaction-detail mb-active"
							: "transaction-detail"
					}
				>
					<div className="transaction-section-title strong">
						Detail Pemesanan
					</div>
					<table className="table-detail-main">
						{/* <tr>
							<td>Pemesan</td>
							<td>{data.purchasable_instructor}</td>
						</tr> */}
						<tr>
							<td>Nomor Tagihan</td>
							<td>{data.invoice_number}</td>
						</tr>
						<tr>
							<td>Tanggal Pembelian</td>
							<td>{FormatDateIndo(data.created_at)}</td>
						</tr>
						<tr>
							<td>Item</td>
							<td></td>
						</tr>
					</table>
					<table className="table-detail-item">
						<tbody>
							<tr>
								<td>{data.purchasable_title}</td>
								<td>{FormatPrice(data.payment_amount)}</td>
							</tr>
							{data.deductions &&
								data.deductions.map(deduction => {
									return (
										<tr>
											<td>{deduction.label}</td>
											<td className="font-red">
												-{FormatPrice(deduction.amount)}
											</td>
										</tr>
									);
								})}
						</tbody>
						<tfoot className="strong">
							<tr>
								<td>Total</td>
								<td>{finalPrice}</td>
							</tr>
						</tfoot>
					</table>
				</section>
				{/* End Transaction Detail */}

				{// Floating Upload Button
				data.status == TransactionConstants.STATUS_PENDING && (
					<section className="container-small transaction-pending floating-section">
						<div>Upload bukti untuk menyelesaikan pembayaran</div>
						<Button
							onClick={() => this.setState({ isActiveFormUpload: true })}
							className="btn btn-small no-border full strong mt-ss"
						>
							Upload Bukti Pembayaran
						</Button>
					</section>
				)
				// End Floating Upload Button
				}

				{// Pop Up Form Upload
				data.status == TransactionConstants.STATUS_PENDING && (
					<div
						id="formUploadPayment"
						className={
							isActiveFormUpload ? "fragment-page active" : "fragment-page"
						}
					>
						<div className="container-small fragment-page-top">
							<span className="fragment-page-top-title strong">
								Konfirmasi Pembayaran
							</span>
							<button
								className="fragment-page-top-close"
								onClick={() => this.setState({ isActiveFormUpload: false })}
							>
								<Icon small>clear</Icon>
							</button>
						</div>
						<div className="container-small fragment-page-content">
							<div className="fragment-page-content-top">
								<div className="fragment-page-input-group mb-xss">
									<label for="bankTransfer">Transfer ke Bank</label>
									<select id="bankTransfer" onChange={this.handleChangeBank}>
										<option value="">Pilih Bank</option>
										{bankData &&
											bankData.map(bank => {
												return (
													<option
														value={bank.id}
														selected={bankData.length === 1}
													>
														{bank.name}
													</option>
												);
											})}
									</select>
								</div>
								{!buktiTransferData && (
									<form
										id="form-upload"
										className="fragment-page-input-group mb-xss"
									>
										<div id="upload_button" className="full">
											<label>
												<input
													name="receipt"
													onChange={this.handleChangeBuktiTransfer}
													type="file"
												/>
												<span className="btn btn-small full">
													Upload Bukti Pembayaran
												</span>
											</label>
											<input
												name="bank_id"
												value={selectedBankId}
												type="hidden"
											/>
										</div>
									</form>
								)}
								{buktiTransferData && (
									<div className="d-flex-ai-center">
										<img
											id="upload-image-output"
											className="img-object-fit-contain mr-s"
											src={URL.createObjectURL(uploadedImageData)}
											style={{ width: "130px" }}
										/>
										<div>
											<div className="break-word">{uploadedImageData.name}</div>
											<form
												id="form-upload"
												className="fragment-page-input-group mb-xss"
											>
												<div
													id="upload_button"
													className="fragment-page-input-group mb-xss"
												>
													<label>
														<input
															name="receipt"
															onChange={this.handleChangeBuktiTransfer}
															type="file"
														/>
														<span className="btn btn-small">Ganti Bukti</span>
													</label>
													<input
														name="bank_id"
														value={selectedBankId}
														type="hidden"
													/>
												</div>
											</form>
										</div>
									</div>
								)}
							</div>
							<Button
								onClick={this.handleSubmitUpload}
								className="container-small btn btn-small full"
							>
								Submit
							</Button>
						</div>
					</div>
				)}

				{// Transaction - Verified
				data.status == TransactionConstants.STATUS_VERIFIED && (
					<section className="container-small transaction-pending floating-section">
						{itemType == TransactionConstants.TYPE_COURSE && (
							<Link
								className="btn btn-small full"
								to={`/course/${data.purchasable_slug}`}
							>
								Jelajahi Modul
							</Link>
						)}
						{itemType == TransactionConstants.TYPE_EVENT && (
							<Link
								className="btn btn-small full"
								to={`/event/${data.purchasable_slug}`}
							>
								Jelajahi Event
							</Link>
						)}
						{itemType == TransactionConstants.TYPE_LEARNING_PATH && (
							<Link
								className="btn btn-small full"
								to={`/learning-path/${data.purchasable_slug}`}
							>
								Jelajahi Learning Path
							</Link>
						)}
					</section>
				)}
			</div>
		);
	}
}

export default TransactionDetail;
