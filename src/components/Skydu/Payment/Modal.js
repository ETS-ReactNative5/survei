import React from 'react'
import { Link } from 'react-router-dom'
import Image from '../Image';
import {Col, Row, ProgressBar, Icon, Preloader, Modal, Button, Input, Label} from 'react-materialize'
import { FormatPrice, CheckAuth, API_PROFILE_BASE_URL, API_TRX, API_BANK_LIST, API_VAL_VOUCHER, AjaxSetup } from '../Util'
import UserConstants from '../User/Constants';
import Notifications, {notify} from 'react-notify-toast';
import TransactionConstants from '../Transaction/Constants';
import { withRouter } from 'react-router-dom'
import {trans} from '../Lang'
import $ from 'jquery';
import store from 'store'
import PinInput from 'react-pin-input'
import ReactTooltip from 'simple-react-tooltip';
import FontAwesome from 'react-fontawesome';

class PaymentModal extends React.Component {
	constructor(props) {
	    super(props);
	    AjaxSetup(props);
	    let company = store.get("company")

		this.state = {payment_method : TransactionConstants.BANK_TRANSFER, company : company, paytren_token : '', input_voucher : false, value_voucher : false, voucher_data : null}
	}

	componentDidMount() {
		if (!this.state.userData && CheckAuth()) {
			this.handleLoadBankList();
		}    
	}

	handleInputVoucher = () =>{
		if (this.state.input_voucher == false){
			this.setState({input_voucher : true});
			document.getElementById("text-voucher").innerHTML = "Batalkan Voucher";
			document.getElementById("text-voucher").style.cssText = "text-decoration: underline; color: red";
		} else{
			this.setState({input_voucher : false});
			this.setState({value_voucher : false});
			document.getElementById("text-voucher").innerHTML = "Punya kode voucher?";
			document.getElementById("text-voucher").style.cssText = "text-decoration: underline; color: blue";
		}
		
	}

	handleSubmitVoucher = () => {
		var voucher = document.getElementById("add-voucher").value;
		$.get(API_VAL_VOUCHER + voucher)
		.then((result) => {
			notify.show("Voucher Berhasil Digunakan", "success", 3000);
			this.setState({voucher_data : result, value_voucher : true});
			//console.log(this.state.voucher_data.max_amount);
	  	});
	}

	handleLoadBankList = () => {
	    $.get(API_BANK_LIST, {per_page : 5})
	      .then((result) => {
	        this.setState({banks : result.data, bank_uid : result.data[0].uid});
	    });
	}

	handleTypeNumber = (event) => {
		var charCode = parseInt(event.charCode);
		if(charCode != 13 && (charCode < 48 || charCode > 57) ) {
		  event.preventDefault();
		}
	}

	handlePinChange = (e) => {
	    var errorMessage = "";
	    var pinPattern = /^\d{6}$/;

		if(!pinPattern.test(e.target.value)) {
		  errorMessage ="PIN harus terdiri dari 6 digit angka";
		}

		this.setState({errorMessage: errorMessage});
	}

	handleInputChange = (e) => {
	    let state = this.state;
	    let identifier = e.target.name ? e.target.name : e.target.id

	    state[identifier] = e.target.value;

		this.setState(state);
		
		if (e.target.name == "payment_method"){
			this.setState({input_voucher : false, value_voucher : false});
			document.getElementById("text-voucher").innerHTML = "Punya kode voucher?";
			document.getElementById("text-voucher").style.cssText = "text-decoration: underline; color: blue";
		}
	}

	handleSubmitPayment = (e) => {
	    if (e) {
	      e.preventDefault();
	    }

	    let {payment_method, phone, paytren_token, bank_uid, value_voucher, voucher_data} = this.state;

	    let userdata = CheckAuth();
	  	let qty = this.props.qty || 1
	  	let item = this.props.item
	  	let itemType = this.props.itemType

	    let couponCode = "";
	    let pin = $("#pin").val();

		let param;
		if (paytren_token == "" && value_voucher == true){
			param = {
				item_uid : item.uid,
				bank_uid : bank_uid,
				item_type : itemType || 1,
				phone : this.props.phone,
				metadata : JSON.stringify(this.props.metadata),
				payment_method : payment_method,
				phone : phone,
				paytren_token : paytren_token,
				voucher_code : voucher_data.code
			};
		} else{
			param = {
				item_uid : item.uid,
				bank_uid : bank_uid,
				item_type : itemType || 1,
				phone : this.props.phone,
				metadata : JSON.stringify(this.props.metadata),
				payment_method : payment_method,
				phone : phone,
				paytren_token : paytren_token
			};
		}
		//console.log(param);
		
	    $.post(API_TRX, param)
	    .then((data) => {
	      if (data.message = "success") {
	        $(".modal-close").trigger("click");
    		$(".loading").hide();
    		this.props.history.push(`/transactions/${data.uid}`);
	      }
	      
	    }).fail((XMLHttpRequest, textStatus, errorThrown) => {
	      var response = null
	      var status = XMLHttpRequest.status;

	      try {
	        response = JSON.parse(XMLHttpRequest.responseText);
	      } catch(e) {}

	      if (response && response.status) {
	        this.setState({errorMessage : response.message});
	      }
	    });
	}

	getLoading = () => {
		return <center><Preloader className="loading" size="medium" /></center>
	}

  	render() {
  		let title = this.props.title
  		let qty = this.props.qty || 1
  		let item = this.props.item
  		let disableVoucher = this.props.disableVoucher
  		let accountType = CheckAuth().account_type;
		let price = this.props.amount || item.price
		let final_price = price * (1 - item.discount/100)
		//console.log(price);

  		let {userData, banks, company, payment_method, paytren_token, bank_uid, voucher_data, input_voucher, value_voucher} = this.state

  		if ((false && banks && banks.length == 1 && !company.is_paytren_enabled) || price == 0) {
  			return <Button id="btn-pay" onClick={this.handleSubmitPayment} className="hide" />
  		}

  		if (voucher_data) {
  			voucher_data.max_amount = Number.MAX_SAFE_INTEGER
  		}

  		return (
  			<Modal header={<span>{title}</span>} trigger={<Button id="btn-pay" className="hide" />}>
	  			<hr/>
	  			<form autocomplete="off" onSubmit={this.handleSubmitPayment} className="mb-0 row">

	  			<div className="valign-wrapper">
	  				<h5 className="half">Harga Item:</h5>
	  				<h4 className="font-orange right-align half">{FormatPrice(qty * price, item.discount)}</h4>
	  			</div>
				
				{value_voucher != false &&
				<div>
		  			<div className="valign-wrapper">
		  				<h5 className="half">Diskon Voucher:</h5>
		  				<h5 className="font-red font-light right-align half">-{((qty * final_price * voucher_data.discount * 0.01) < voucher_data.max_amount ? FormatPrice(qty * final_price * voucher_data.discount * 0.01) : FormatPrice(voucher_data.max_amount))}</h5>

		  			</div>
		  			<hr style={{margin : '0px 0px 10px'}} />
		  			<div className="valign-wrapper">
		  				<h5 className="half">Total:</h5>
		  				<h4 className="font-orange right-align half">{FormatPrice(Math.max(qty * final_price - (qty * final_price * voucher_data.discount * 0.01), qty * final_price - voucher_data.max_amount))}</h4>
		  			</div>
		  		</div>
				}

	  			{payment_method == TransactionConstants.PAYTREN && item.paytren_discount_amount > 0 && <div>
		  			<div className="valign-wrapper">
		  				<h5 className="half">Diskon PayTren:</h5>
		  				<h5 className="font-red font-light right-align half">-{FormatPrice(item.paytren_discount_amount)}</h5>

		  			</div>
		  			<hr style={{margin : '0px 0px 10px'}} />
		  			<div className="valign-wrapper">
		  				<h5 className="half">Total:</h5>
		  				<h4 className="font-orange right-align half">{FormatPrice(Math.max(0, qty * final_price - item.paytren_discount_amount))}</h4>
		  			</div>
		  		</div>
	  			}

				<div>
					{(payment_method == TransactionConstants.BANK_TRANSFER || payment_method == TransactionConstants.MIDTRANS) &&
					<a id="text-voucher" onClick={this.handleInputVoucher} style={{textDecoration: "underline", color: "blue"}}>Punya kode voucher?</a>
					}
					
					{input_voucher != false &&
					<div className="valign-wrapper">
						<input id="add-voucher" placeholder="Masukkan kode voucher..." style={{borderBottom : "none", border : "1px solid #9e9e9e", paddingLeft : 10, margin : 0, borderRadius : ".25rem", height : 33}}></input>
						<div className="btn right-align" style={{lineHeight : 2.5, width : "50%",fontSize : "15px", fontWeight : "bold", padding : 0, borderRadius : ".25rem" , height : 35}} onClick={this.handleSubmitVoucher}>GUNAKAN</div>
					</div>
					}
				</div>
	  			<br/>

	  			{(company.is_paytren_enabled || company.is_midtrans_enabled) &&
	  				<Col s={12}>
	  				<label>Pilih metode pembayaran</label>
	  				<div className="btn-radio">
	  				<Input label={
	  					<div className="valign-wrapper"><FontAwesome name="exchange" /><span> &nbsp; Bank Transfer</span></div>
	  					} onChange={this.handleInputChange} id="bank-transfer" type="radio" name="payment_method" checked={payment_method == TransactionConstants.BANK_TRANSFER} value={TransactionConstants.BANK_TRANSFER} />
	  				<Input label={
	  					<div className="valign-wrapper"><span className="icon-paytren" /><span> &nbsp; PayTren</span></div>
	  					} onChange={this.handleInputChange} id="paytren" type="radio" name="payment_method" checked={payment_method == TransactionConstants.PAYTREN} value={TransactionConstants.PAYTREN} />

	  				{company.is_midtrans_enabled &&
	  				<Input label={
	  					<div>Midtrans</div>
	  					} onChange={this.handleInputChange} id="midtrans" type="radio" name="payment_method" checked={payment_method == TransactionConstants.MIDTRANS} value={TransactionConstants.MIDTRANS} />
	  				}
	  				</div>
	  				</Col>
	  			}

	  			{payment_method == TransactionConstants.BANK_TRANSFER &&
	  				<Col s={12}>

	  				<div className="strong border-bottom pb-s mb-s">
	  				
	  				{banks && banks.length == 1 ? "Transfer Ke" : `${trans.select} Bank`}
	  				</div>
	  				{banks && banks.map((bank)=>{
	  					return <Input checked={bank_uid == bank.uid} className="with-gap" required onChange={this.handleInputChange} s={12} name="bank_uid" value={bank.uid} type='radio' label={<span>
	  						<img className="height-30" src={bank.logo_url} /><br/>
	  						{bank_uid == bank.uid && <span>
		  						<span className="font-light">No. Rekening</span>
		  						<h5 className="font-black font-light">{bank.account_number} a.n. {bank.account_owner}</h5>
		  					</span>}
	  					</span>
	  					} />
	  				})}

	  				</Col>
	  			}

	  			{payment_method == TransactionConstants.PAYTREN &&
	  				<Col s={12} className="mb-0">
	  				<div className="center mb-s">
	  				<img className="height-30" src="/img/banks/paytren.png" />
	  				</div>

	  				<Input onKeyPress={this.handleTypeNumber} m={12} label="No Telpon yang terdaftar di PayTren" name="phone" onChange={this.handleInputChange} required />

	  				<label>Kode bayar yang didapat dari aplikasi PayTren</label>
	  				<div className="mt-xs mb-s">
	  				<PinInput required length={6} onChange={(value, index) => {this.setState({'paytren_token' : value})}} onComplete={(value, index) => {console.log(value + " " + index)}}  />
	  				</div>
	  				<div className="link mb-s" data-tip='1'>
                    Cara Mendapatkan Kode Bayar
                  </div>
                  <ReactTooltip type="light" border={true} getContent={(dataTip) => <div>
                  	<h5 className="font-orange">Cara Mendapatkan Kode Bayar</h5>
                  	<ol style={{marginLeft : '-27px', lineHeight : '30px'}}>
	                  	<li>Buka Aplikasi Paytren</li>
	                  	<li>Lakukan Login dengan Akun Anda</li>
	                  	<li>Cari dan tekan button “Bayar”</li>
	                  	<li>Tekan “Kode Bayar”</li>
	                  	<li>Masukkan PIN Anda untuk keamanan dan mendapatkan Kode Bayar</li>
	                  	<li>Salin “Kode Bayar” dan masukkan di halaman Pembayaran dengan Paytren</li>
                  	</ol>
                  	</div>
                  } effect='solid' place='top' />

	  				</Col>
	  			}

	  			{payment_method == TransactionConstants.MIDTRANS &&
	  			<Row>
	  				<Col s={12}>
	  					<div className="valign-wrapper">
	  						<img style={{height : '40px'}} src="/img/banks/permata.jpg" />
			  				<img src="/img/banks/gopay.png" />
			  			</div>
	  				</Col>
	  			</Row>
	  			}

	  			<div className="red-text mb-s strong">{this.state.errorMessage}</div>

	  			<Button disabled={payment_method == TransactionConstants.PAYTREN && paytren_token.length != 6} id="enroll-btn" s={12} className="full capitalize" waves='light'>{title}</Button>
	  			</form>
  			</Modal>
  		)
	}
}

export default withRouter(PaymentModal)
