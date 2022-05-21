import React, { Component } from 'react';
import store from 'store';
import $ from 'jquery';
import { API_TRX, API_BANK_LIST, FormatPrice, FormatDateIndo } from '../Util';
import { notify } from 'react-notify-toast';
import { Button, Icon } from 'react-materialize';
import TransactionConstants from './Constants';

class MobileView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: this.props.data,
            status: this.props.status,
            invoiceNumber: this.props.invoiceNumber,
            bankData: '',
            selectedBankUid: '',
            isActiveFormUpload: false,
            buktiTransferData: '',
            uploadedImageData: ''
        }
    }

    componentDidMount = () => {
        this.handleLoadBankList();
    }

    handleLoadBankList = () => {
        $.get(API_BANK_LIST, {per_page : 5}).then((result) => {
            // console.log("API BANK LIST >>> ", result);

            this.setState({
                bankData: result.data,
                selectedBankUid: (result.data.length === 1) ? result.data[0].name : ''
            });
        });
    }

    handleCopyAccount = (accountNumber) => {
        let textArea = document.createElement("textarea");

        textArea.value = accountNumber.split('-').join('');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove()
        notify.show("Teks tersalin", "success", 3000)
    }

    handleChangeBank = (e) => {
        let {value} = e.target;

        this.setState({selectedBankUid: value})
    }

    handleChangeBuktiTransfer = (e) => {
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

    handleLoadData(reload = false) {
        $.getJSON(API_TRX + "/" + this.state.invoiceNumber)
        .then((data) => {   
            this.setState({ data: data }, () => {
                // console.log("HANDLE LOAD DATA SUCCESS");
    
                if (!reload) { 
                    this.scrollToTop();
    
                    if (data.snap_token && data.status != TransactionConstants.STATUS_VERIFIED) {
                        const snap = window.snap
                        snap.pay(data.snap_token)
                    }
                } else {
                    window.location.reload(true);
                }
            });
        });
    }

    handleConfirmTransfer = () => {
        $.ajax(API_TRX + "/" + this.state.invoiceNumber + "/confirm", {method : 'put'})
        .then((data) => {
            this.handleLoadData(true);
            // console.log("HANDLE CONFIRM TRANSFER SUCCESS >>>", data);
        });
    }

    handleSubmitUpload = (e) => {
        let {data, buktiTransferData, invoiceNumber, selectedBankUid} = this.state;
        let param;
        
        if (!selectedBankUid) {
            notify.show("Bank tidak boleh kosong", "warning");
        } else if (!buktiTransferData) {
            notify.show("Upload bukti transfer Anda", "warning");
        } else {
            // 1. PUT UPLOADED IMAGE
            $.ajax({
                url: API_TRX + "/" + invoiceNumber + "/upload_receipt" ,
                data: buktiTransferData,
                type: 'PUT',
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
            }).then((data) => {
                // 2. CHANGE STATUS TO CONFIRMED
                // console.log(" 2 >> HASIL DATA API TRX INVOICE NUMBER >>> ", data);
                this.handleConfirmTransfer();
            });
        }

        e.preventDefault();
    }

    scrollToTop(offset) {
        if (!offset) { offset = 0; }
        $("html, body").animate({ scrollTop: offset });
    }

    render() {
        let {data, status, bankData, isActiveFormUpload, buktiTransferData, uploadedImageData, selectedBankUid} = this.state;
        let company = store.get('company');
        let receiptURLName = '';

        let price = FormatPrice(data.grand_total + data.unique_code).split(".");
        let priceRight = price.pop();
        let priceLeft = price.join(".");

        if (!data) { return super.render() }

        if (data.receipt_url) {
            let splitReceiptURL = data.receipt_url.split('/');
            receiptURLName = splitReceiptURL[splitReceiptURL.length - 1];
        }

        if (isActiveFormUpload) {
            $('html').css({overflowY: 'hidden'})
            window.close();
        } else {
            $('html').css({overflowY: 'scroll'})
        }

        // console.log("DATA >>> ", data);
        // console.log("STATE >>> ", this.state);
        // console.log("PROPS >>> ", this.props);

        return (
            <div className="hide-on-desktop-view">
                {   // Transaction Pipe 
                    (status == TransactionConstants.STATUS_PENDING || status == TransactionConstants.STATUS_CONFIRMED || status == TransactionConstants.STATUS_VERIFIED ) &&

                    <section className="transaction-pipe center-align">
                        <div className="transaction-pipe-item">
                            <div className="pipe-item-bullet bg-dark"></div>
                            <div className="pipe-item-line bg-dark"></div>
                            <div className="pipe-item-title font-dark">Pembayaran</div>
                        </div>
                        <div className="transaction-pipe-item">
                            <div className={status == TransactionConstants.STATUS_CONFIRMED ? "pipe-item-bullet bg-dark" : "pipe-item-bullet bg-grey"}></div>
                            <div className={status == TransactionConstants.STATUS_VERIFIED ? "pipe-item-line bg-dark" : "pipe-item-line bg-grey"}></div>
                            <div className={status == TransactionConstants.STATUS_CONFIRMED ? "pipe-item-title font-dark" : "pipe-item-title font-grey"}>Menunggu Konfirmasi</div>
                        </div>
                        <div className="transaction-pipe-item">
                            <div className={status == TransactionConstants.STATUS_VERIFIED ? "pipe-item-bullet bg-dark" : "pipe-item-bullet bg-grey"}></div>
                            <div className={status == TransactionConstants.STATUS_VERIFIED ? "pipe-item-title font-dark" : "pipe-item-title font-grey"}>Siap Belajar</div>
                        </div>
                    </section>              
                    // End Transaction Pipe
                }

                {   // Transaction Payment
                    (status == TransactionConstants.STATUS_PENDING) &&

                    <section className="transaction-pending transaction-payment">
                        <div className="transaction-payment-inner">
                            <div className="transaction-section-subtitle center-align">Segera Lakukan Pembayaran</div>
                                <div className="transaction-section-content center-align">
                                <div className="content-text-wrapper">
                                    <span className="content-text strong">{priceLeft}.<span className="font-red">{priceRight}</span></span>
                                    <a className="button-primary bg-dark-inverse font-orange" onClick={this.props.handleCopyTotal}>Salin</a>
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
                                    <span className="content-text strong">{FormatDateIndo(data.expired_at, true)} WIB</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    // End Transaction Payment
                }

                {   // Transaction Bank List
                    (status == TransactionConstants.STATUS_PENDING) &&
                    
                    <section className="transaction-pending transaction-bank-transfer">
                        <div className="transaction-section-subtitle center-align">Transfer ke salah satu rekening kami</div>
                        <div className="transaction-section-content">
                        { (bankData) && bankData.map((bank) => {
                            return (
                                <div className="bank-transfer-item">
                                    <div className="item-left">
                                        <img className="bank-account-image" src={bank.logo_url} />
                                        <div className="bank-account-number strong">{bank.account_number}</div>
                                        <div className="bank-account-name">(a/n {bank.account_owner})</div>
                                    </div>
                                    <div className="item-right">
                                        <a className="button-primary bg-dark-inverse font-orange" onClick={() => this.handleCopyAccount(bank.account_number)}>Salin</a>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </section>
                    // End Transaction Bank List
                }

                {   // Transaction - Menunggu Pembayaran && Kalo sudah melakukan transfer
                    (data.receipt_url || status == TransactionConstants.STATUS_CONFIRMED) &&

                    <section className="transaction-waiting-for-confirmation center">
                        <img src="/img/asset_time.svg" />
                        <div className="transaction-section-title strong">Pembayaran Sedang Diproses</div>
                        <span>Mohon tunggu, kami akan melakukan pengecekan paling lambat 2x24 jam.</span>
                    </section>
                    // End Transaction - Menunggu Pembayaran
                }

                {   // Transaction - Kedaluwarsa -> Kalo belum melakukan transfer
                    (!data.receipt_url && status == TransactionConstants.STATUS_EXPIRED) &&

                    <section className="transaction-expired center">
                        <img className="mb-xss" src="/img/popup_error.svg" style={{ width: '130px' }} />
                        <div className="transaction-section-title strong">Mohon Maaf, Waktu Pembayaran Anda Sudah Habis</div>
                        <span>
                            Jika Anda merasa sudah melakukan transfer, harap mengirim email ke <a className="font-light-orange" href={`mailto:${company.email}`}>{company.email}</a> dengan menyertakan bukti transfer Anda
                        </span>
                    </section>
                    // End Transaction - Kedaluwarsa
                }

                {   // Transaction - Ditolak
                    (status == TransactionConstants.STATUS_REJECTED) &&

                    <section className="transaction-expired center">
                        <img className="mb-xss" src="/img/popup_error.svg" style={{ width: '130px' }} />
                        <div className="transaction-section-title strong">Mohon maaf, kami tidak dapat memverifikasi pembayaran Anda</div>
                        <span>
                            Jika ada kesulitan dalam pembayaran, harap mengirim email ke <a className="font-light-orange" href={`mailto:${company.email}`}>{company.email}</a> dengan menyertakan bukti transfer Anda
                        </span>
                    </section>
                    // End Transaction - Ditolak
                }

                {   // Transaction - Kedaluwarsa namun sudah upload bukti transfer
                    (data.receipt_url && status != TransactionConstants.STATUS_REJECTED) &&

                    <section className="transaction-bukti-transfer">
                        <div className="transaction-section-title strong">Bukti Transfer</div>
                        <div className="bukti-transfer-bank">
                            <span>Transfer ke Bank</span>
                            <span className="bukti-transfer-bank-bankname">{selectedBankUid}</span>
                        </div>
                        <div className="bukti-transfer-image">
                            <img src={data.receipt_url} />
                        </div>
                    </section>
                    // End Transaction - Kedaluwarsa namun sudah upload bukti transfer
                }
                
                {/* Transaction Detail */}
                <section className={(status == TransactionConstants.STATUS_PENDING) ? "transaction-detail mb-active" : "transaction-detail"}>
                    <div className="transaction-section-title strong">Detail Pemesanan</div>
                    <table className="table-detail-main">
                    <tr>
                        <td>Pemesan</td>
                        <td>{data.user.name}</td>
                    </tr>
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
                                <td>{data.item.name}</td>
                                <td>{FormatPrice(data.amount)}</td>
                            </tr>
                            { (data.deductions) && 
                                
                                data.deductions.map((deduction) => {
                                    return (
                                        <tr>
                                            <td>{deduction.label}</td>
                                            <td className="font-red">-{FormatPrice(deduction.amount)}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td>Kode Unik</td>
                                <td>{FormatPrice(data.unique_code)}</td>
                            </tr>
                        </tbody>
                        <tfoot className="strong">    
                            <tr>
                                <td>Total</td>
                                <td>{FormatPrice(data.grand_total + data.unique_code)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
                {/* End Transaction Detail */}

                {   // Transaction - Kedaluwarsa namun sudah upload bukti transfer - KHUSUS REJECTED
                    (data.receipt_url && status == TransactionConstants.STATUS_REJECTED) &&

                    <section className="transaction-bukti-transfer">
                        <div className="transaction-section-title strong">Bukti Transfer</div>
                        <div className="bukti-transfer-bank">
                            <span>Transfer ke Bank</span>
                            <span className="bukti-transfer-bank-bankname">{selectedBankUid}</span>
                        </div>
                        <div className="bukti-transfer-image">
                            <img src={data.receipt_url} />
                        </div>
                    </section>
                    // End Transaction - Kedaluwarsa namun sudah upload bukti transfer - KHUSUS REJECTED
                }

                {   // Floating Upload Button
                    (status == TransactionConstants.STATUS_PENDING) &&
                    
                    <section className="transaction-pending floating-section">
                        <div>Upload bukti untuk menyelesaikan pembayaran sebelum <span className="font-red">{FormatDateIndo(data.expired_at, true)} WIB</span></div>
                        <Button
                            onClick={() => this.setState({isActiveFormUpload: true}) }
                            className="button-primary bg-dark no-border full strong mt-ss">
                            Upload Bukti Pembayaran
                        </Button>
                    </section>
                    // End Floating Upload Button
                }

                {   // Pop Up Form Upload
                    
                    /* NOTE Berarti ini ngehit 2 API dong? API bank yang dipilih dan API Receipt
                    soalnya, yg API receipt url gaada param lagi selain urlnya */

                    (status == TransactionConstants.STATUS_PENDING) &&

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
                                        {   
                                            (bankData) && bankData.map((bank) => {
                                                return (
                                                    <option value={bank.uid} selected={bankData.length === 1}>{bank.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                { (!buktiTransferData) &&
                                    <form id="form-upload" className="fragment-page-input-group mb-xss">
                                        <div id="upload_button" className="full">
                                            <label>
                                                <input name="receipt" onChange={this.handleChangeBuktiTransfer} type="file" />
                                                <span className="btn button-primary bg-dark-inverse font-orange full strong">Upload Bukti Pembayaran</span>
                                            </label>
                                            <input name="bank_uid" value={selectedBankUid} type="hidden" />
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
                                                        <span className="btn button-primary bg-dark-inverse font-orange strong">Ganti Bukti</span>
                                                    </label>
                                                    <input name="bank_uid" value={selectedBankUid} type="hidden" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                }
                            </div>
                            <Button
                                onClick={this.handleSubmitUpload}
                                className="button-primary bg-dark no-border strong mt-ss">
                                Submit
                            </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default MobileView;