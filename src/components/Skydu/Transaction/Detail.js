import React from 'react'
import store from 'store'
import $ from 'jquery';
import { QueryParam, API_BANK_LIST, API_TRX, API_CONFIRM_TRANSACTION, FormatPrice, CheckAuth, FormatDateIndo, FormatTime } from '../Util'
import { Row, Col, ProgressBar, Input, Tabs, Tab, Button, Modal, Table, Icon } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import GoogleMapReact from 'google-map-react';
import Sticky from 'react-sticky-el';
import Page from '../Page';
import TransactionConstants from './Constants';
import {trans} from '../Lang';
import FontAwesome from 'react-fontawesome';
import App from '../App';
import ReactTooltip from 'simple-react-tooltip';
import moment from 'moment'
import MobileView from './MobileView';
import { isArray } from 'util';

class TransactionDetail extends Page {

	constructor(props) {
	    super(props);

      this.state = {
        data: null,
        invoice_number: props.match.params.invoice_number
      };
	}

  componentDidMount() {
    super.componentDidMount();
    this.handleLoadData();
  }

  handleLoadData() {
    $.getJSON(API_TRX + "/" + this.state.invoice_number)
      .then((data) => {   
        this.setState({ data: data });
        this.scrollToTop();

        if (data.snap_token && data.status != TransactionConstants.STATUS_VERIFIED) {
          const snap = window.snap
          snap.pay(data.snap_token)
        }

        // console.log("HANDLE LOAD DATA SUCCESS");
    });
  }

  handleConfirmTransfer = () => {
    $.ajax(API_TRX + "/" + this.state.invoice_number + "/confirm", {method : 'put'})
      .then((data) => {   
        window.location.reload();
        this.handleLoadData();
        // console.log("HANDLE CONFIRM TRANSFER SUCCESS");
    });
  }

  handleDeleteTransaction = (uid) => {
    $.ajax(API_TRX + "/" + uid + "/delete", {method : 'put'})
      .then((data) => {   
        notify.show("Anda berhasil meninggalkan antrian", "success", 3000)
        this.props.history.push("/left_transaction");
    });
  }

  handleUploadProof = (e) => {
    let formData = new FormData($("#form-upload")[0]);

    var file = e.target.files[0];

    if (file.type.indexOf("image") === -1) {
      notify.show("File harus berupa gambar", "warning");
      e.target.value='';
      return;
    }

    $.ajax({
        url: API_TRX + "/" + this.state.invoice_number + "/upload_receipt" ,
        data: formData,
        type: 'PUT',
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        // ... Other options like success and etc
    }).then((data) => {
      this.handleLoadData();
    });
  }

  render() {
  		let {data, invoice_number} = this.state;
      let company = store.get('company');
      
      if (!data) {
        return super.render();
      }

      let amount = data.amount + data.voucher_amount;
      let flashSaleAmount = data.item.price * (data.discount / 100);
      let voucherAmount = 0;
      let uniqueCode = data.unique_code;

      data.price = data.amount / (data.quantity || 1);

      let itemLabel = TransactionConstants.label(data.item.type);
      let itemType = "";

      if (itemLabel == trans.course) {
          itemType = "course";
      } else if (itemLabel == trans.learning_path) {
          itemType = "learning-path";
      } else {
          itemType = itemLabel.toLowerCase().replace(" ", "-");
      }

      // console.log("DATA >>> ", data);
      // console.log("STATE >>> ", this.state);
      // console.log("PROPS >>> ", this.props);

      if (data.status == TransactionConstants.STATUS_QUEUED) {
        return <QueuedTransaction onDelete={this.handleDeleteTransaction} data={data} />
      } else if (data.status != TransactionConstants.STATUS_VERIFIED) {
        return (
          <PendingTransaction 
            data={data}
            invoice_number={invoice_number}
            handleUploadProof={this.handleUploadProof} 
            handleConfirmTransfer={this.handleConfirmTransfer}
            handleLoadData={this.handleLoadData}
          />
        )
      }

  		return (
  			<div className="transaction-page">
          {/* Desktop View */}
          <div className="hide-on-mobile-view bg-white fullheight">
            <div className="center mb-m pt-m">
              <br/>
              <img src="/img/course/ic_checklist.png" />
              <h4 className="mt-s">{data.amount > 0 ? "Success!" : "Sukses"}</h4>
              <div className="font-grey h5 font-light">Your {itemLabel} has been saved to your profile</div>
            </div>
            {company.is_sale_enabled && <div className="container-medium">
              <Row>
                <Col s={12} m={6}>
                  <div className="almost-full pad-m-s">
                    <h5>Item</h5><hr className="strong" />
                    <PurchasedItem data={data} />
                    {data.discount > 0 && 
                    <div>
                      <span className="right font-red">- {FormatPrice(data.amount, 100 - data.discount)}</span>
                        Discount {data.discount}%
                    </div>
                    }

                    <hr className="strong" />
                    <h4 className="mb-0"><span className="font-orange right">{FormatPrice(data.amount, data.discount)}</span>Total</h4>
                    <hr className="strong" />
                  </div>
                </Col>

                <Col s={12} m={6}>
                  <div className="almost-full pad-m-s">
                    <h5>{trans.transaction_detail}</h5><hr className="strong" />

                    <table className="narrow">
                      <tr>
                        <td>Ordered by</td><td width="30px">:</td><td className="strong">{CheckAuth().name}</td>
                      </tr>
                      <tr>
                        <td>Invoice Number</td><td width="30px">:</td><td className="strong">{data.invoice_number}</td>
                      </tr>
                      <tr>
                        <td>{trans.ordered_at}</td><td width="30px">:</td><td className="strong">{FormatDateIndo(data.created_at)}</td>
                      </tr>
                    </table>
                    
                  </div>
                </Col>
              </Row>
              <br/>
            </div>
            }
            <div className="center mb-m wide-300">
              <br/>
              {itemType == 'course' && 
              <Link className="btn full capitalize" to={`/${itemType}/${data.item.uid}`}>Start Learning!</Link>
              }    
            </div>
            &nbsp;
          </div>
          {/* End Desktop View */}

          {/* Mobile View */}
          <div className="hide-on-desktop-view mt-sxs">
            <section className="transaction-pipe center-align">
              <div className="transaction-pipe-item">
                <div className="pipe-item-bullet bg-dark"></div>
                <div className="pipe-item-line bg-dark"></div>
                <div className="pipe-item-title font-dark">Pembayaran</div>
              </div>
              <div className="transaction-pipe-item">
                <div className="pipe-item-bullet bg-dark"></div>
                <div className="pipe-item-line bg-dark"></div>
                <div className="pipe-item-title font-dark">Menunggu Konfirmasi</div>
              </div>
              <div className="transaction-pipe-item">
                <div className="pipe-item-bullet bg-dark"></div>
                <div className="pipe-item-title font-dark">Siap Belajar</div>
              </div>
            </section>

            <section className="transaction-success center">
              <img className="mb-xss" src={"/img/popup_berhasil.svg"} />
              <div className="transaction-section-title strong">Pembayaran Berhasil</div>
              <span>Paket berlangganan Anda telah diaktifkan</span>
            </section>

            <section className="transaction-detail mb-active">
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
                  { (data.is_flash_sale != 0) &&
                      <tr>
                        <td>Diskon Flash Sale</td>
                        <td className="font-red">-{FormatPrice(flashSaleAmount)}</td>
                      </tr>
                  }
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
                  { (data.voucher && data.voucher.discount != 100 || data.voucher_amount == 0) &&
                  <tr>
                    <td>Kode Unik</td>
                    <td>{FormatPrice(uniqueCode)}</td>
                  </tr>
                  }
                </tbody>
                <tfoot className="strong">    
                  <tr>
                    <td>Total</td>
                    <td>{(data.voucher && data.voucher.discount == 100) ? "GRATIS" : FormatPrice(data.grand_total + data.unique_code)}</td>
                  </tr>
                </tfoot>
              </table>
            </section>
            <section className="transaction-pending floating-section">
              <Link
                to={ (itemType == 'course') ? `/course/${data.item.uid}` : '/course/catalog' }
                className="btn button-primary bg-dark no-border full strong">
                Jelajahi Modul
              </Link>
            </section>
          </div>
          {/* End Mobile View */}
        </div>
  		)
	}
}

class LeftTransaction extends Page {
  render() {
    return (
      <div className="pt-m pd-l full-height">
          <div className="bg-white" style={{maxWidth:'500px', margin:'auto'}}>
              <div className="pad-m">
                <div className="center mb-s">
                  <h4>Kamu Telah Keluar Antrian!</h4>
                  
                </div>

                <p className="mb-s">
                  Jika kamu ingin mendaftar lagi ke event ini maka kamu akan mengulangi antrian dari awal.
                </p>

                <Link className="btn full" to={"/"}>Kembali ke Halaman Depan</Link>
              </div>
          </div>
        </div>
      )
  }
}

class QueuedTransaction extends React.Component {
  handleDeleteTransaction = () => {
    this.props.onDelete(this.props.data.uid)
  }

  render() {
    let {data} = this.props

    return (
      <div className="pt-m pad-l full-height">
          <div className="bg-white" style={{maxWidth:'600px', margin:'auto'}}>
              <div className="pad-m">
                <div className="center mb-m mt-s">
                  <img className="mb-m" style={{maxWidth:'300px'}} src='/img/event/img_waiting_list.png' />
                  <h4>Kamu Masuk Daftar Tunggu...</h4>
                  <div className="link h5 mb-0" data-tip='1'>
                    Kenapa?
                  </div>
                  <ReactTooltip effect='solid' place='bottom' getContent={(dataTip) => <div>
                    Karena kuota daftar saat ini sedang penuh dan akan tersedia lagi<br/>saat ada yang tidak menyelesaikan pembayaran dalam 1x24 jam secara otomatis
                    </div>} />
                  
                </div>

                <p>
                  Tapi tenang! Walaupun masuk daftar tunggu, kami akan memberikan informasi jika kamu sudah keluar dari daftar tunggu dan bisa melanjutkan ke pembayaran. Pastikan email kamu aktif ya, supaya kami bisa mengirimkan pembaruan status kamu lewat email!<br/><br/>

                  Terima kasih ya sudah antusias dengan event <b>{data.item.name}</b>! 
                </p>
                
                <Row className="mb-0 mt-s">
                  <Col m={6}>
                    <Modal trigger={ 
                          <Button className="btn btn-outline almost-full">Tinggalkan Antrian</Button>
                        }><h4 className="mb-s">Konfirmasi</h4>
                        <div>Apakah kamu yakin ingin meninggalkan antrian?<br/>Anda harus mengantri ulang jika ingin kembali mendaftar event ini</div>
                        <div className="mt-s">                  
                          <a className="btn modal-close btn-outline">BATAL</a>
                          <a onClick={this.handleDeleteTransaction} className="btn modal-close right">YAKIN</a>
                        </div>
                    </Modal>
                  </Col>
                  <Col m={6}><Link className="btn almost-full right" to={"/transactions"}>Ke Transaksi Saya</Link></Col>
                </Row>

                
              </div>
          </div>
        </div>
      )
  }
}

class PurchasedItem extends React.Component {

  render() {
    let data = this.props.data
    let isCoupon = false
    let qty = data.quantity || 1;
    let url = `/course/${data.item.uid}`;

    if (isCoupon) {
      url = `/coupon/${data.item.uid}`;
    }

    return (
      <Link to={url}>
        <div className={"bg-white section-card small"}>
          <Image src={data.item.image_url} className="small" />
          <div className="content">
            <div className="strong mb-xs">{data.item.name}</div>

            <div className="strong font-orange mb-xs">{FormatPrice(data.amount, data.discount)}</div>
            
            {isCoupon &&
              <div className="font-tiny font-grey strong valign-wrapper mb-xs"><Icon tiny>card_giftcard</Icon>
                <span>
                  &nbsp;Kupon Course x {qty}
                </span>
              </div>
            }
            
          
          </div>        
        </div>
      </Link>
    )
  }
}

class PendingTransaction extends React.Component {
  static TYPE_EVENT = 4

  constructor(props) {
    super(props);

    this.state = {
      bankListData: '',
      bankListUid: ''
    }
  }

  copiedAccount = (e) => {
    let input = document.getElementById("account");
    var textArea = document.createElement("textarea");
    textArea.value = input.textContent.replace("-","");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove()
    notify.show("Teks tersalin", "success", 3000)
  }

  copiedTotal = (e) => {
    let input = document.getElementById("totalFixed");
    var textArea = document.createElement("textarea");
    textArea.value = input.textContent.replace(/[Rp.]/g,"");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove()
    notify.show("Teks tersalin", "success", 3000)
  }

  render() {
      let {data, invoice_number} = this.props;

      if (!data) { return super.render() }

      let {bankListData, bankListUid} = this.state;


      let status = data.status
      let company = store.get('company')
      let price = FormatPrice(data.amount, data.discount, data.unique_code)
      let priceSplit = price.split(".")
      let priceRight = priceSplit.pop()
      let priceLeft = priceSplit.join("");
      
      let amount = data.amount + data.voucher_amount;
      let flashSaleAmount = data.item.price * (data.discount / 100)
      let voucherAmount = 0;
      let uniqueCode = data.unique_code;

      let receiptURLName = "";
      let expiredDays = data.item.type == PendingTransaction.TYPE_EVENT ? 1 : 5;

      if (data.receipt_url) {
        let split = data.receipt_url.split('/')
        receiptURLName = split[split.length - 1]
      }

      return (
        <div className="transaction-page mt-sxs">
          {/* Desktop View */}
          <div className="hide-on-mobile-view">
            <Row className="narrow container mt-m">
              <Col m={5} s={12} className="pad-m">
                <Sticky hideOnBoundaryHit={false} boundaryElement=".narrow" topOffset={-30} stickyStyle ={{"paddingTop" : "30px"}}>
                <h5 className="mb-s hide">{trans.transaction_detail}</h5>
                <div className="bg-white mb-s pb-0">
                  <div className="pad-m border-bottom">
                    <div className="strong mb-xs">Invoice Number</div>
                    <div className="mb-s">{data.invoice_number}</div>
                    <div className="strong mb-xs">{trans.ordered_at}</div>
                    <div>{FormatDateIndo(data.created_at)}</div>
                  </div>
                  <div className="pad-m pb-0">
                    <div className="strong mb-s">{TransactionConstants.label(data.item.type)}</div>
                    <PurchasedItem className="section-card" data={data} /> 
                  </div>
                </div>  
                </Sticky>
              </Col>
              <Col className="mt-sxs mb-m" m={7} s={12}>
                <h5 className="mb-s hide">Status Transaksi</h5>
                <div className="pad-m bg-white">
                  {status == TransactionConstants.STATUS_PENDING &&
                  <div>
                    <div className="valign-wrapper mb-s">
                      <div className="badge left center-align lh-50">1</div>
                      <div className="h5">Please transfer before</div>
                    </div>

                    <div className="border-all pad-m mb-m">

                      <div className="h5">{FormatDateIndo(data.expired_at, true, true)} WIB</div>
                      <div className="strong">Please complete your payment before {data.is_flash_sale ? '1x12hours' : `${expiredDays}x24 hours`}</div>
                    </div>
                    {data.bank &&
                      <div>
                        <div className="valign-wrapper mb-s">
                          <div className="badge left center-align lh-50">2</div>
                          <div className="h5">Transfer to</div>
                        </div>

                        <div className="border-all strong mb-m">
                          <div className="pad-m bg-grey h4">{data.bank.name}</div>
                          <Row className="pad-m border-bottom mb-0">
                            <Col s={4}>Account Number</Col><Col s={8}>
                            <div className="relative col">
                                <span id="account" className="mb-0 form-message" style={{borderBottom: "0px", height : "auto", padding : "0px 15px 0px 0px"}}>{data.bank.account_number}</span>
                                <a onClick={this.copiedAccount} style={{top : '-5px'}} title="Salin" className="send-message"><i className="material-icons" style={{color : "orange"}}>content_copy</i></a>
                            </div>
                            </Col>
                            <Col s={4}>Account Owner</Col><Col s={8}><span>{data.bank.account_owner}</span></Col>
                          </Row>
                          <Row className="pad-m mb-0">
                            <Col s={4}>Total</Col><Col s={8}>
                              <div className="inline-block link" ref='total' data-tip='Please transfer with exact amount'>
                                <div className="relative col">
                                  <span id="totalFixed" className="mb-0 form-message" style={{borderBottom: "0px", height : "auto", padding : "0px 15px 0px 0px"}}>{FormatPrice(data.grand_total, 0, data.unique_code)}</span>
                                  <a onClick={this.copiedTotal} style={{top : '-5px'}} title="Salin" className="send-message"><i className="material-icons" style={{color : "orange"}}>content_copy</i></a>
                                </div>
                              </div> &nbsp;
                                {data.discount > 0 && <span className="strike font-grey">{FormatPrice(data.amount)}</span>}
                              <ReactTooltip effect='solid' place='left' />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    }

                    <div className="valign-wrapper mb-s">
                      <div className="badge left center-align lh-50">3</div>
                      <div className="h5">Already Transfered?</div>
                    </div>

                    <div className="border-all pad-m">
                      <div className="strong mb-s">
                      Tekan tombol "I Have Transfered" jika Anda telah melakukan pembayaran. Kami Akan lakukan pengecekan pembayaran paling lambat 2 x 24jam.
                        
                      </div>

                      <a onClick={this.props.handleConfirmTransfer} className="btn capitalize full">I have transfered</a>
                    </div>
                  </div>
                  }

                  {(status != TransactionConstants.STATUS_PENDING && data.bank) &&
                  <div>
                    <div className="border-all strong mb-m">
                      <div className="pad-m" style={{fontWeight : "bold"}}>Terima Kasih atas pembayaran transaksi Anda ke:</div>
                      <div className="pad-m bg-grey h4">{data.bank.name}</div>
                      <Row className="pad-m border-bottom mb-0">
                        <Col s={4}>Account Number</Col><Col s={8}>{data.bank.account_number}</Col>
                        <Col s={4}>Account Owner</Col><Col s={8}>{data.bank.account_owner}</Col>
                      </Row>
                      <Row className="pad-m mb-0">
                        <Col s={4}>Total</Col><Col s={8}>
                          <div className="inline-block link" ref='total' data-tip='Please transfer with exact amount'>{FormatPrice(data.grand_total, 0, data.unique_code)}</div> &nbsp;
                            {data.discount > 0 && <span className="strike font-grey">{FormatPrice(data.amount)}</span>}
                          <ReactTooltip effect='solid' place='left' />
                        </Col>
                      </Row>
                    </div>

                    <div className="border-all pad-m mb-s">
                      <div className="strong">Status transaksi Anda</div>
                      <div className="h5 font-light-orange">{TransactionConstants.statusLabel(data.status)}</div>         
                    </div>

                    <div className="border-all pad-m">
                      {!data.receipt_url && status == TransactionConstants.STATUS_CONFIRMED &&
                      <form id="form-upload">
                        <Icon large>description</Icon>
                        <div className="h5 mb-xs">(Wajib) Upload bukti untuk mempercepat verifikasi</div>
                        <div className="strong mb-xss">Kami akan melakukan pengecekan pembayaran paling lambat 2 x 24 jam</div>  
                        

                        <div id="upload_button" className="mb-xss">
                          <label>
                            <input name="receipt" onChange={this.props.handleUploadProof} type="file" />
                            <span className="btn capitalize btn-small">Upload Bukti Pembayaran</span>
                          </label>
                        </div>

                        <div className="strong mb-xss">Upload dalam format JPG, PNG, atau JPEG file max 3MB</div>    
                      </form>
                      }

                      {data.receipt_url && status == TransactionConstants.STATUS_CONFIRMED &&
                      <div>             
                        <FontAwesome name="check-circle-o" size="5x" className="green-text light mb-s" />
                        <h5>Terima kasih, bukti pembayaran Anda telah kami terima!</h5>
                        <div className="strong font-grey">Pembayaran Anda akan kami proses secepatnya</div>
                      </div>
                      }

                      { status == TransactionConstants.STATUS_EXPIRED &&
                      <div>             
                        <FontAwesome name="times-circle-o" size="5x" className="red-text light mb-s" />
                        <h5>Mohon maaf, waktu transfer Anda sudah habis</h5>
                        <div className="strong font-grey">
                          Jika Anda merasa sudah melakukan transfer, harap mengirim email ke <a className="font-light-orange" href={`mailto:${company.email}`}>{company.email}</a> dengan menyertakan bukti transfer Anda
                        </div>
                      </div>
                      }

                      {status == TransactionConstants.STATUS_REJECTED &&
                      <div>             
                        <FontAwesome name="times-circle-o" size="5x" className="red-text light mb-s" />
                        <h5>Mohon maaf, kami tidak dapat memverifikasi pembayaran Anda</h5>
                        <div className="strong font-grey">
                          Jika ada kesulitan dalam pembayaran, harap mengirim email ke <a className="font-light-orange" href={`mailto:${company.email}`}>{company.email}</a> dengan menyertakan bukti transfer Anda
                        </div>
                      </div>
                      }
                    </div>

                  </div>
                  }
                </div>
              </Col>
            </Row>
          </div>
          
          {/* End Desktop View */}

          {/* Mobile View */}
          <MobileView 
            data={data}
            status={status}
            invoiceNumber={invoice_number}
            handleCopyTotal={this.copiedTotal}
          />
          {/* End Mobile View */}
        </div>
      )
  }
}

export default TransactionDetail
export {LeftTransaction}