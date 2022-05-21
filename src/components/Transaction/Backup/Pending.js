import React, { Component } from 'react';
import $ from 'jquery';
import { Button, Icon } from 'react-materialize';
import { FormatPrice, FormatDateIndo } from '../../Util';
import { notify } from 'react-notify-toast';
import Page from '../../Page';

class TransactionPending extends Page {
	constructor(props) {
		super(props);

		this.state = {
			isActiveFormUpload: false,
			buktiTransferData: "",
			uploadedImageData: ""
		}
	}

	handleChangeBuktiTransfer = (e) => {
		e.preventDefault();
        let formData = new FormData($("#form-upload")[0]);
        let file = e.target.files[0];

        if (file.type.indexOf("image") === -1) {
            notify.show("File harus berupa gambar", "warning");
            e.target.value='';
            return;
        }

        this.setState({
            buktiTransferData: formData,
            uploadedImageData: file
        });
	}
	
	handleSubmitUpload = () => {
		let { uploadedImageData } = this.state;

		if (uploadedImageData) {
			this.props.history.push('/transactions/confirmed', { imageURL: URL.createObjectURL(uploadedImageData) });
		} else {
			notify.show("Tidak ada gambar yang diupload", "warning");
		}
	}

	render() {
		let { isActiveFormUpload, buktiTransferData, uploadedImageData } = this.state;

		return (
			<div className="transaction-page mt-sxs">
				<section className="transaction-pipe center-align">
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-dark"></div>
						<div className="pipe-item-line bg-grey"></div>
						<div className="pipe-item-title font-dark">Pembayaran</div>
					</div>
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-grey"></div>
						<div className="pipe-item-line bg-grey"></div>
						<div className="pipe-item-title font-grey">Menunggu Konfirmasi</div>
					</div>
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-grey"></div>
						<div className="pipe-item-title font-grey">Siap Belajar</div>
					</div>
				</section>

				<section className="transaction-pending transaction-payment">
					<div className="transaction-payment-inner">
						<div className="transaction-section-subtitle center-align">Segera Lakukan Pembayaran</div>
							<div className="transaction-section-content center-align">
							<div className="content-text-wrapper">
								<span className="content-text strong">Rp590.<span className="font-red">022</span></span>
								<a className="btn btn-pa button-primary bg-dark-inverse font-white" onClick={this.props.handleCopyTotal}>Salin</a>
							</div>
							<div className="payment-info align-left">
								<span className="info-icon">
									<img src="/img/info.png" />
								</span>
								<span className="info-message">
									<span className="strong font-red">Penting! </span>
									<span>Mohon transfer tepat sampai 3 angka terakhir</span>
								</span>
							</div>
						</div>
					</div>
					<div className="transaction-payment-inner center-align">
						<div className="transaction-section-subtitle">Sebelum tanggal</div>
						<div className="transaction-section-content">
							<div className="content-text-wrapper">
								<span className="content-text strong">{FormatDateIndo("2019-12-23 11:59:36", true)} WIB</span>
							</div>
						</div>
					</div>
				</section>

				<section className="transaction-pending transaction-bank-transfer">
					<div className="transaction-section-subtitle center-align">Transfer ke salah satu rekening kami</div>
					<div className="transaction-section-content">
						<div className="bank-transfer-item">
							<div className="item-left">
								<img className="bank-account-image" src="http://development.skydu.net/img/banks/bca.png" />
								<div className="bank-account-number strong">1234567890-1</div>
								<div className="bank-account-name">(a/n Skydu School)</div>
							</div>
							<div className="item-right">
								<a className="btn btn-pa button-primary bg-dark-inverse font-white" onClick={(e) => e.preventDefault()}>Salin</a>
							</div>
						</div>
					</div>
				</section>

				<section className="transaction-detail">
					<div className="transaction-section-title strong">Detail Pemesanan</div>
					<table className="table-detail-main">
						<tr>
							<td>Pemesan</td>
							<td>Ummi Asyifa</td>
						</tr>
						<tr>
							<td>Nomor Tagihan</td>
							<td>20191218/17550220004421</td>
						</tr>
						<tr>
							<td>Tanggal Pembelian</td>
							<td>18 Desember 2019</td>
						</tr>
						<tr>
							<td>Item</td>
							<td></td>
						</tr>
					</table>
					<table className="table-detail-item">
						<tbody>
							<tr>
								<td>Cara Bentuk Tim untuk Kru Film</td>
								<td>{FormatPrice(26000)}</td>
							</tr>
							<tr>
								<td>Kode Unik</td>
								<td>{FormatPrice(22)}</td>
							</tr>
						</tbody>
						<tfoot className="strong">    
							<tr>
								<td>Total</td>
								<td>{FormatPrice(26022)}</td>
							</tr>
						</tfoot>
					</table>
				</section>

				<section className="transaction-pending floating-section">
					<div className="mb-xss">Upload bukti untuk menyelesaikan pembayaran sebelum <span className="font-red">{FormatDateIndo("2019-12-23 11:59:36", true)} WIB</span></div>
					<Button
						onClick={() => this.setState({isActiveFormUpload: true}) }
						className="btn btn-pa button-primary bg-dark no-border full strong mt-ss">
						Upload Bukti Pembayaran
					</Button>
				</section>

				<div id="formUploadPayment" className={(isActiveFormUpload) ? "fragment-page active" : "fragment-page"}>
					<div className="fragment-page-top">
						<span className="fragment-page-top-title strong">Konfirmasi Pembayaran</span>
						<button className="fragment-page-top-close" onClick={() => this.setState({isActiveFormUpload: false})}>
							<Icon small>clear</Icon>
						</button>
					</div>
					<div className="fragment-page-content">
						<div className="fragment-page-content-top">
							<div className="fragment-page-input-group mb-xss">
								<label for="bankTransfer">Transfer ke Bank</label>
								<select id="bankTransfer" onChange={this.handleChangeBank}>
									<option value="">Pilih Bank</option>
									<option value="#">BCA</option>
								</select>
							</div>
							{ (!buktiTransferData) &&
								<form id="form-upload" className="fragment-page-input-group mb-xss">
									<div id="upload_button" className="full">
										<label>
											<input name="receipt" onChange={this.handleChangeBuktiTransfer} type="file" />
											<span className="btn btn-pa button-primary bg-dark-inverse font-white full strong">Upload Bukti Pembayaran</span>
										</label>
									</div>
								</form> 
							}
							{ (buktiTransferData) &&
								<div className="d-flex-ai-center">
									<img id="upload-image-output" className="img-object-fit-contain mr-s" src={URL.createObjectURL(uploadedImageData)} style={{width: '130px'}} />
									<div>
										<div className="break-word">{uploadedImageData.name}</div>
										<form id="form-upload" className="fragment-page-input-group mb-xss">
											<div id="upload_button" className="fragment-page-input-group mb-xss">
												<label>
													<input name="receipt" onChange={this.handleChangeBuktiTransfer} type="file" />
													<span className="btn btn-pa button-primary bg-dark-inverse font-white strong">Ganti Bukti</span>
												</label>
											</div>
										</form>
									</div>
								</div>
							}
						</div>
						<Button
							onClick={ this.handleSubmitUpload }
							className="btn btn-pa button-primary bg-dark no-border strong mt-ss">
							Submit
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default TransactionPending;