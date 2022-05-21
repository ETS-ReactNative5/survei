/* eslint-disable */
import $ from 'jquery';
import React from 'react';
import { Button, Col, Input, Modal, Preloader, Row } from 'react-materialize';
import { notify } from 'react-notify-toast';
import PinInput from 'react-pin-input';
import { Link, withRouter } from 'react-router-dom';
import store from 'store';
import { jade_green, pastel_red } from '../../styles/ColorConsts';
import '../../styles/payment-modal.css';
import TransactionConstants from '../Transaction/Constants';
import UserConstants from '../User/Constants';
import { AjaxSetup, API_PAYMENT, API_PROFILE_BASE_URL, BASE_URL, CheckAuth, FormatNumber, FormatPrice } from '../Util';

const NEGATIVE_SIGN = "1";
const POSITIVE_SIGN = "9";

class PaymentModal extends React.Component {
	constructor(props) {
	    super(props);
	    AjaxSetup(props);
	    this.state = {
			payment_method : TransactionConstants.DEPOSIT,
			total_price: props.item.price,
			payment_confirmed: false,
			typed_code: '',
			show_detail : false
		}
	}

	componentDidMount() {
		if (!this.state.userData && CheckAuth()) {
			this.handleLoadProfile();
		}
	}

	handleLoadProfile = () => {
	    $.get(API_PROFILE_BASE_URL)
	      .then((data) => {
	        this.setState({userData : data.payload});
	    });
	}

	handleTypePin = (event) => {
		var charCode = parseInt(event.charCode,10);
		if(charCode !== 13 && (charCode < 48 || charCode > 57) ) {
		  event.preventDefault();
		}
	}

	handleTextChange = (e) => {
		let state = this.state;
		state[e.target.name] = e.target.value;
		this.setState({state});
	}

	handlePinChange = (value, index) => {
		this.setState({typed_code: value});
	}

	handleInputChange = (e) => {
	    let state = this.state;
	    let identifier = e.target.name ? e.target.name : e.target.id

	    state[identifier] = e.target.value;

	    this.setState(state);
	}

	onClickPaymentButton = (e) => {
		this.setState({payment_confirmed: true});
	}

	pinInputBox() {
		let {errorMessage} = this.state

		return(
			<div>
			<PinInput
          		length={6}
          		focus
          		secret
          		type="numeric"
				style={{display:"flex", justifyContent: "space-between", marginTop:'1rem'}}
          		inputStyle={{borderRadius:'8px', borderColor:'#e0e0e0', backgroundColor:'#e0e0e0'}}
          		onChange={this.handlePinChange}
        	/>

        	{errorMessage && <span className="font-red"><br/>{errorMessage}</span>}
        	</div>
		);
	}

	calculationBox(item, qty) {
		// const { price, discount, user_cashback, score, title } = item;
		const { price, user_cashback, score, title } = item;
		const { total_price, payment_method, show_detail } = this.state;

		let useDeposit = payment_method === TransactionConstants.DEPOSIT

		const ItemComponent = ({name, value=0, value_sign, is_price=true, className=''}) =>
		<Row className="item-component">
			<Col className={className} s={8} m={8} l={8}>
				<span style={{color: value_sign === POSITIVE_SIGN ? jade_green : ''}}>{name}</span>
			</Col>
			<Col className={className} s={4} m={4} l={4}>
            	<span className="right" style={{color:  value_sign === NEGATIVE_SIGN ? pastel_red :  value_sign === POSITIVE_SIGN ? jade_green: ""}}>
					{ value_sign === NEGATIVE_SIGN? "-":  value_sign === POSITIVE_SIGN ? "+" : "" } { is_price ? FormatPrice(value) : value }
				</span>
        	</Col>
		</Row>
		return(
			<div id="calc-container">
				<div className={show_detail ? "animated show" : "animated"}>
					<ItemComponent name={title + " x " +  qty} value={item.total_price ? item.total_price * qty : price * qty}/>
					<ItemComponent name="Rabat" value={useDeposit ? user_cashback * qty : 0}  value_sign={POSITIVE_SIGN}/>
					<ItemComponent name="Score" value_sign={POSITIVE_SIGN} value={useDeposit ? score * qty : 0} is_price={false} />
					{<ItemComponent name="Diskon" value={item.total_price ? qty * (item.total_price - price) : 0}  value_sign={NEGATIVE_SIGN}/>}
					<hr className="mt-0"/>
				</div>
					<ItemComponent name="Total" className="mb-0" value={total_price * qty}/>


			</div>
		);
	}

	handleSubmitPayment = (e) => {
	    if (e) {
	      e.preventDefault();
	    }

	    let userdata = CheckAuth();
	    let method = this.state.payment_method;
	  	let qty = this.props.qty || 1
	  	let item = this.props.item
	  	let itemType = this.props.itemType
	  	let itemData = this.props.itemData
			//console.log(itemType);

	    let pin = this.state.typed_code;

	    if(item.community_redeemable) {
	      method = TransactionConstants.COMMUNITY;
	    } else if (item.price === 0) {
	      pin = "000000";
	      method = TransactionConstants.DEPOSIT;
	    }



	    let param = {
	      method : method,
	      item_type : itemType,
	      item_quantity : qty,
	      item_uuid : item.uuid,
	      item_data : itemData || "",
	      pin : pin,
	      coupon_code : "",
	    };

	    $.post(API_PAYMENT, param)
	    .then((data) => {
	      if (data.message = "success") {
	        if( !item.voucher_redeemable && method == TransactionConstants.DEPOSIT) {
	          let amount = qty * item.price;

	          if (userdata.saldo >= amount) {
	            userdata.saldo -= amount;    // ngurangin saldo
	            store.set("userdata", userdata);
	          }
	        } else if (method == TransactionConstants.PUT) {
	          let amount = qty * item.put_price;
	          let saldoput = parseInt(userdata.saldoput);

	          if (saldoput >= amount) {
	            saldoput -= amount;    // ngurangin saldo
	            userdata.saldoput = saldoput;
	            store.set("userdata", userdata);
	          }
	        }

	      $(".modal-close").trigger("click");
    		$(".loading").hide();
				const itemString = itemType.toUpperCase() + " BOUGHT";
				let { payload } = data;
    		this.props.history.push(`/transactions/${data.payload.invoice_number}`);
	      }

	    }).fail((XMLHttpRequest, textStatus, errorThrown) => {
	      var response = null
	      var status = XMLHttpRequest.status;


	      try {
	        response = JSON.parse(XMLHttpRequest.responseText);
	      } catch(e) {}

	      if (response && response.status) {
	        this.setState({errorMessage : response.message});
	        notify.show(response.message, "warning");
	      }
	    });
	}

	getPaymentConfirmationScreen(payment_method){
		const method = parseInt(payment_method);
		if(method === TransactionConstants.DEPOSIT || method === TransactionConstants.PUT) {
			console.log(payment_method);
			return(
				<div className="payment-code-input">
					<h5>Masukkan Kode Bayar</h5>
					{this.pinInputBox()}
				</div>
			);
		} else {
			return(
				<div>
					<h5>Konfirmasi Pembayaran</h5>
					<span>Apa kamu yakin membeli modul ini dengan menggunakan Kupon Belajar?</span>
				</div>
			);
		}
	}

	getLoading = () => {
		return <center><Preloader className="loading" size="medium" /></center>
	}

	hasBalance = () => {
		let { payment_method, total_price, userData } = this.state;
		let qty = this.props.qty || 1

		let total = total_price * qty

		if (!userData) {
			return false;
		}

		if (payment_method == TransactionConstants.DEPOSIT) {
			return userData.deposit_balance >= total
		} else if (payment_method == TransactionConstants.PUT) {
			return userData.put_balance >= total
		} else if (payment_method == TransactionConstants.VOUCHER) {
			return userData.voucher_primary >= total
		}
	}

  	render() {
  		let method = this.state.payment_method;
  		let qty = this.props.qty || 1
  		let accountType = CheckAuth().account_type;
		let { userData, total_price, payment_confirmed, show_detail } = this.state;
		const isUsingVoucher = method === "1" || method === "11";
		const { title, item, disableVoucher } = this.props;
		const PaymentInfo = <div>
				<a className="right link" onClick={(e) => {this.setState({show_detail : !show_detail})}}>{show_detail ? 'Hide' : 'Show'} Detail</a>
				  <h5 className="mb-s">Item </h5>
				  {this.calculationBox(item, qty)}

				  <div className="modal-section-head mt-s">
					  <h5>Metode Pembayaran</h5>
					  {/*<h5 className="right font-orange">Top Up</h5>*/}
				  </div>
				  {!userData && this.getLoading()}
				  {userData && <div>
				  	<Input required onChange={this.handleInputChange} s={12} name="payment_method" value={TransactionConstants.DEPOSIT} type='radio' label={
                            <span>Beli dengan saldo PayTren
							 <br/>
                              {method == TransactionConstants.DEPOSIT && <span className="font-black">Sisa Saldo : <b className="font-orange">{FormatPrice(userData.deposit_balance)}</b></span>}
                            </span>
                          } checked={
                            method == TransactionConstants.DEPOSIT
                          } disabled={
                            CheckAuth().account_type != UserConstants.PAYTREN_ACCOUNT
                          } />

                        <Input required onChange={this.handleInputChange} s={12} name="payment_method" value={TransactionConstants.PUT} type='radio' label={
                            <span>Beli dengan PUT (Point Unit Treni)<br/>
                              {method == TransactionConstants.PUT && <span className="font-black">Sisa Saldo : <b className="font-orange">{FormatNumber(userData.put_balance * 1)} PUT</b></span>}
                            </span>
                          } checked={
                            method == TransactionConstants.PUT
                          } disabled={
                            CheckAuth().account_type != UserConstants.PAYTREN_ACCOUNT
						} />

                        {!disableVoucher &&
                        <Input required onChange={this.handleInputChange} s={12} name="payment_method" value={TransactionConstants.VOUCHER} type='radio' label={
                            <span>Beli dengan Poin Belajar <br/>
                              {method == TransactionConstants.VOUCHER && <span className="font-black">Sisa Poin Belajar {item.voucher_redeemable ? "Ekstra" : "Utama"} : <b className="font-orange">

                              {FormatPrice(item.voucher_redeemable && !this.state.buy_coupon ? userData.voucher_deposit : userData.voucher_primary)}</b></span>}
                            </span>
                          } checked={
                            method == TransactionConstants.VOUCHER
                          } disabled={
                            CheckAuth().account_type != UserConstants.PAYTREN_ACCOUNT
                          } />
                        }
                    </div>}
				</div>;

  		if (item.communities && item.communities.length > 0 && !item.community_redeemable) {
  			return <Modal trigger={
              <Button id="btn-pay" className="hide" />
            }>
              <div className="center almost-full">
                <img className="mt-s mb-m" src={BASE_URL + "/img/img-popup.png"} />
                <div className="mb-m">
                <h4 className="center"><b>Gabung Komunitas</b></h4>
                Maaf, item ini hanya bisa diakses oleh anggota komunitas <b>{item.communities[0].title}</b><br/>
                Untuk mengetahui informasi lebih lanjut silakan klik tombol di bawah ini
                </div>
                <Link to={item.communities[0].website_url} target="_blank" className="btn modal-close capitalize">Info Lebih Lanjut</Link>
                <h4/>
              </div>
            </Modal>
  		}

  		else if (item.price == 0) {
  			if (accountType == UserConstants.PAYTREN_ACCOUNT || item.community_redeemable) {	// member komunitas / member paytren bisa beli course gratis
  				return <Button onClick={this.handleSubmitPayment} id="btn-pay" className="hide" />
  			} else {
  				return <Modal trigger={
		          <Button id="btn-pay" className="hide" />
		        }>
		          <div className="center almost-full">
		          <img className="mb-s" src={BASE_URL + "/img/ic_announcement.png"} />
		          <h4 className="font-light">Perhatian</h4>
		          <div className="mb-m">
		          Item ini gratis hanya untuk mitra Paytren, silahkan login dengan ID Paytren Anda
		          </div>
		          <a className="btn modal-close capitalize btn-outline">Oke</a>
		          </div>
		        </Modal>
  			}
  		}

  		let hasBalance = this.hasBalance();

  		return (
  			<Modal header={<span className="valign-wrapper">{payment_confirmed && <i className="material-icons modal-back-btn" onClick={() => this.setState({payment_confirmed: false})}>arrow_back</i>} {title}</span>} trigger={<Button id="btn-pay" className="hide" />}>
            	<hr/>
				{ !payment_confirmed && PaymentInfo }
				{ payment_confirmed &&  this.getPaymentConfirmationScreen(method) }
				{ payment_confirmed && isUsingVoucher &&
					<Button id="enroll-btn"
						s={12}
						className="left voucher-payment-button voucher-cancel"
						waves='light'
						onClick={ () => this.setState({payment_confirmed: false}) }>
						Batal
					</Button>
				}

				{!hasBalance && <span className="font-red">Saldo {TransactionConstants.paymentMethods[method]} tidak mencukupi, silakan gunakan metode pembayaran lain</span>}

				<Button id="enroll-btn"
					disabled={!hasBalance}
					s={12}
					className={isUsingVoucher && payment_confirmed ? "right voucher-payment-button" : "full"}
					waves='light'
					onClick={ !payment_confirmed? this.onClickPaymentButton : this.handleSubmitPayment }>
					{ !payment_confirmed ? "Lanjutkan" : total_price > 0 && !isUsingVoucher ? "Bayar - " + FormatPrice(total_price * qty) : "Bayar"}
				</Button>
				<br/>
		     </Modal>
  		)
	}
}

export default withRouter(PaymentModal)
