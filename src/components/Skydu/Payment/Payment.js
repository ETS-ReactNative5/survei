import React from 'react';
import $ from 'jquery';
import store from 'store'
import Page from '../Page';
import {Button, Icon} from 'react-materialize'
import TransactionConstants from '../Transaction/Constants';
import { AjaxSetup, FormatPrice, CheckAuth, API_BANK_LIST, API_VAL_VOUCHER, API_TRX } from '../Util';
import PinInput from 'react-pin-input';
import {notify} from 'react-notify-toast';

class Payment extends Page {
    constructor(props) {
        super(props);

        AjaxSetup(props);

        this.state = {
            bankData: '',
            bankUid: '',
            company : store.get("company"),
            propsItem: '',
            propsTitle: '',
            propsItemType: '',
            propsQty: '',
            paymentMethod: TransactionConstants.BANK_TRANSFER,
            voucherData: '',
            inputVoucher: '',
            inputPaytrenPhone: '',
            inputPaytrenCode: '',
            isActiveButtomSheet: false
        }
    }

    componentDidMount = () => {
        let locationState = this.props.location.state;

        if (locationState) {
            if (!this.state.userData && CheckAuth()) {
                this.handleLoadBankList();
                this.setState({
                    propsItem: locationState.item,
                    propsItemType: locationState.itemType,
                    propsQty: locationState.qty,
                }, () => {
                    // console.log("PROPS ITEM >>> ", this.state.propsItem);
                    // console.log("PROPS ITEM TYPE >>> ", this.state.propsItemType);
                    // console.log("PROPS ITEM QTY >>> ", this.state.propsQty);
                });
            }  
        } else {
            this.props.history.push('/');
        }

        this.scrollToTop();
    }

    handleLoadBankList = () => {
        $.get(API_BANK_LIST, {per_page : 5})
            .then((result) => {
                // console.log("API BANK LIST >>> ", result);

                this.setState({
                    bankData : result.data, 
                    bankUid : result.data[0].uid
                });
            });
    }
    
    handleChangeInputVoucher = (e) => {
        let {value} = e.target;

        this.setState({inputVoucher: value.toUpperCase()})
    }

    handleCancelVoucher = () => {
        let {inputVoucher} = this.state;

        if (inputVoucher) {
            this.setState({
                inputVoucher: '',
                voucherData: ''
            })
        }
    }

    handleChangePaymentMethod = (e) => {
        let {value} = e.target;

        this.setState({paymentMethod: value})
    }

    handleChangePaytrenPhone = (e) => {
        let {value} = e.target;

        this.setState({inputPaytrenPhone: value})
    }
    
    handleChangePaytrenCode = (value) => {
        this.setState({inputPaytrenCode: value})
    }

    handleSubmitVoucher = async () => {
        let {inputVoucher} = this.state;

		$.get(API_VAL_VOUCHER + inputVoucher)
		    .then((result) => {
                console.log("Result Submit Voucher >>> ", result);
                notify.show("Voucher Berhasil Digunakan", "success", 3000);

                this.setState({
                    voucherData : result
                });
          });
    }
    
    handleSubmitPayment = async (e) => {
        let {paymentMethod, propsItem, propsQty, propsItemType, inputPaytrenCode, inputPaytrenPhone, voucherData, bankUid} = this.state;

        let param;
        let item = propsItem;
        let itemType = propsItemType;

        if (inputPaytrenCode == "" && voucherData){
			param = {
				item_uid : item.uid,
				bank_uid : bankUid,
				item_type : itemType || 1,
				phone : this.props.phone,
				metadata : JSON.stringify(this.props.metadata),
				payment_method : paymentMethod,
				phone : inputPaytrenPhone,
				paytren_token : inputPaytrenCode,
				voucher_code : voucherData.code
			};
		} else{
			param = {
				item_uid : item.uid,
				bank_uid : bankUid,
				item_type : itemType || 1,
				phone : this.props.phone,
				metadata : JSON.stringify(this.props.metadata),
				payment_method : paymentMethod,
				phone : inputPaytrenPhone,
				paytren_token : inputPaytrenCode
			};
        }
        
        $.post(API_TRX, param)
            .then((data) => {
                if (data.message = "success") {
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
          
        e.preventDefault();
    }

    scrollToTop(offset) {
        if (!offset) {
            offset = 0;
        }
        $("html, body").animate({ scrollTop: offset });
    }
    
    render() {
        let {bankData, company, propsItem, propsQty, voucherData, paymentMethod, inputVoucher, inputPaytrenCode, isActiveButtomSheet} = this.state;
        
        let qty = propsQty;
        let discount = propsItem.discount;
        let paytrenDiscountAmount = propsItem.paytren_discount_amount;
        let discountVoucher = voucherData.discount;
        let maxAmountVoucher = voucherData.max_amount;
        let price = propsItem.price;
        let priceFinal = price * (1 - discount / 100);

        let deductionVoucher = "Deduction";
        let finalPrice;

        console.log("VOUCHER DATA >>> ", voucherData);
        console.log("PROPS ITEM >>> ", propsItem);
        console.log("qty >>> ", qty);
        console.log("discount >>> ", discount);
        console.log("discountVoucher >>> ", discountVoucher);
        console.log("maxAmountVoucher >>> ", maxAmountVoucher);
        console.log("price >>> ", price);
        console.log("priceFinal >>> ", priceFinal);
        console.log("----------------- DIVIDER -------------------");
        console.log(deductionVoucher)
        console.log(" ");

        // console.log("COMPANY >>> ", company);
        // console.log("TransactionConstants >>> ", TransactionConstants);

        (voucherData.discount !== 100) 
            ? ( ((qty * priceFinal * discountVoucher) / 100) < maxAmountVoucher 
                ? FormatPrice((qty * priceFinal * discountVoucher) / 100) 
                : FormatPrice(maxAmountVoucher) )
            : FormatPrice((qty * priceFinal * discountVoucher) / 100)

        return (
            <div className="container">
                <div className="payment-page">
                    <div className="payment-page-top">
                        <a className="payment-page-top-icon" onClick={() => this.props.history.goBack()}>
                            <i className="material-icons">keyboard_backspace</i>
                        </a>
                        <span className="strong">Pembayaran</span>
                    </div>
                    <form autocomplete="off" onSubmit={this.handleSubmitPayment}>
                        {   // Jika metode pembayaran tidak menggunakan paytren
                            (paymentMethod == TransactionConstants.BANK_TRANSFER || paymentMethod == TransactionConstants.MIDTRANS) &&
                            <section className="payment-input-voucher">
                                <div className="payment-input-voucher-inner">
                                    <input placeholder="Kode Voucher" value={inputVoucher} type="text" onChange={this.handleChangeInputVoucher} />
                                    { !voucherData &&
                                    <a className="button-primary bg-dark-inverse font-orange" onClick={this.handleSubmitVoucher}>Gunakan</a>
                                    }
                                    { voucherData &&
                                    <a className="button-primary button-danger" onClick={this.handleCancelVoucher}>Batal</a>
                                    }
                                </div>
                                { voucherData && 
                                    <div className="payment-voucher-message font-green">Potongan Voucher
                                        &nbsp;
                                        { (voucherData.discount !== 100) 
                                            ? (maxAmountVoucher !== 0)
                                                ?
                                                (((qty * priceFinal * discountVoucher) / 100) < maxAmountVoucher 
                                                    ? FormatPrice((qty * priceFinal * discountVoucher) / 100) 
                                                    : FormatPrice(maxAmountVoucher) )
                                                : FormatPrice((qty * priceFinal * discountVoucher) / 100) 
                                            : FormatPrice((qty * priceFinal * discountVoucher) / 100)
                                        }
                                        <br/>
                                    </div>
                                }
                                <br />
                            </section>
                        }
                        <section className="payment-detail">
                            <div className="payment-section-title">Detail</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{propsItem.title}</td>
                                        <td>{FormatPrice(qty * price, discount)}</td>
                                    </tr>
                                    
                                    {   // Jika voucher berhasil diinput
                                        voucherData && paymentMethod != TransactionConstants.PAYTREN && 
                                        <tr>
                                            <td>Diskon Voucher</td>
                                            <td className="font-red">
                                                - { (voucherData.discount !== 100) 
                                                    ? (maxAmountVoucher !== 0)
                                                        ?
                                                        (((qty * priceFinal * discountVoucher) / 100) < maxAmountVoucher 
                                                            ? FormatPrice((qty * priceFinal * discountVoucher) / 100) 
                                                            : FormatPrice(maxAmountVoucher) )
                                                        : FormatPrice((qty * priceFinal * discountVoucher) / 100) 
                                                    : FormatPrice((qty * priceFinal * discountVoucher) / 100)
                                                }
                                            </td>
                                        </tr>
                                    }
                                    {   // Discount jika pembayaran menggunakan paytren
                                        paymentMethod == TransactionConstants.PAYTREN && paytrenDiscountAmount > 0 &&
                                        <tr>
                                            <td>Diskon Paytren</td>
                                            <td className="font-red">
                                                - {FormatPrice(paytrenDiscountAmount)}
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>    
                                    <tr>
                                        <td>Total</td>
                                        { //default
                                            !voucherData && paymentMethod != TransactionConstants.PAYTREN &&
                                            <td className="strong">
                                            { FormatPrice(priceFinal)}
                                            </td>
                                        }
                                        { //jika menggunakan voucher
                                            voucherData && paymentMethod != TransactionConstants.PAYTREN &&
                                            <td className="strong">
                                            { (voucherData.discount !== 100)
                                                ? (maxAmountVoucher !== 0)
                                                    ? 
                                                        FormatPrice(
                                                            Math.max(qty * priceFinal - ((qty * priceFinal * discountVoucher) / 100), 
                                                            qty * priceFinal - maxAmountVoucher)
                                                        )
                                                    : FormatPrice(qty * priceFinal - ((qty * priceFinal * discountVoucher) / 100))
                                                : "GRATIS"
                                            }
                                            </td>
                                        }
                                        { //jika menggunakan paytren
                                            paymentMethod == TransactionConstants.PAYTREN &&
                                            <td className="strong">
                                            { FormatPrice(Math.max(0, qty * priceFinal - paytrenDiscountAmount)) }
                                            </td>
                                        }
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        <br /> <br />

                        <section className="payment-select-method">
                            <div className="payment-section-title">Metode Pembayaran</div>
                            <select value={paymentMethod} onChange={this.handleChangePaymentMethod}>
                                <option value={TransactionConstants.BANK_TRANSFER}>Bank Transfer</option>
                                {(company.is_paytren_enabled) &&
                                    <option value={TransactionConstants.PAYTREN}>Paytren</option>
                                }
                                {(company.is_midtrans_enabled) &&
                                    <option value={TransactionConstants.MIDTRANS}>Midtrans</option>
                                }
                            </select>
                            <br />
                        </section>

                        { paymentMethod == TransactionConstants.BANK_TRANSFER &&
                            <section className="payment-bank-list">
                                { (bankData) && bankData.map((bank) => {
                                    return (
                                        <span>
                                            <img src={bank.logo_url} />
                                        </span>
                                    )
                                })}
                            </section>
                        }
                        { paymentMethod == TransactionConstants.PAYTREN &&
                            <section className="payment-method-paytren">
                                <div className="payment-input-group">
                                    <label for="payment-paytren-notelp">Nomor Telpon yang terdaftar di Paytren</label>
                                    <input id="payment-paytren-notelp" onChange={this.handleChangePaytrenPhone} type="text" placeholder="Nomor Telpon" />
                                </div>
                                <div className="payment-input-group">
                                    <label for="payment-paytren-notelp">Masukkan Kode Bayar</label>
                                    <PinInput 
                                        length={6} 
                                        initialValue={inputPaytrenCode}
                                        onChange={(value, index) => { this.handleChangePaytrenCode(value, index) }} 
                                        type="numeric" 
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '10px'
                                        }}  
                                        inputStyle={{
                                            border: '0',
                                            borderRadius: '5px',
                                            backgroundColor: '#e0e0e0',
                                            margin: 0
                                        }}
                                        inputFocusStyle={{}}
                                        onComplete={(value, index) => {}}
                                    />
                                </div>
                                <div className="payment-paytren-clue">
                                    <a className="buttom-sheet-trigger" onClick={() => this.setState({isActiveButtomSheet: true})}>Cara mendapatkan Kode Bayar</a>

                                    <div className={isActiveButtomSheet ? "buttom-sheet active" : "buttom-sheet"}>
                                        <div className="buttom-sheet-background" onClick={() => this.setState({isActiveButtomSheet: false})}></div>
                                        <div className="buttom-sheet-wrapper">
                                            <div className="buttom-sheet-top">
                                                <div className="buttom-sheet-title">Kode Bayar</div>
                                                <a className="buttom-sheet-icon" onClick={() => this.setState({isActiveButtomSheet: false})}>
                                                    <Icon small>clear</Icon>
                                                </a>
                                            </div>
                                            <div className="buttom-sheet-content">
                                                <ol>
                                                    <li>Buka Aplikasi Paytren</li>
                                                    <li>Lakukan login dengan akun Anda</li>
                                                    <li>Cari dan tekan button "Bayar"</li>
                                                    <li>Tekan "Kode Bayar"</li>
                                                    <li>Masukkan PIN Anda untuk keamanan dan mendapatkan Kode Bayar</li>
                                                    <li>Salin "Kode Bayar" dan masukkan di halaman Pembayaran dengan Paytren</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        }
                        { paymentMethod == TransactionConstants.MIDTRANS &&
                            <section className="payment-method-midtrans">
                                <img width="130px" src="/img/banks/permata.jpg" />
                                <img width="120px" src="/img/banks/gopay.png" />
                            </section>
                        }

                        <div className="red-text mb-s strong">{this.state.errorMessage}</div>

                        <Button
                            disabled={paymentMethod == TransactionConstants.PAYTREN && inputPaytrenCode.length != 6}
                            id="enroll-btn"
                            className="button-primary bg-dark no-border full strong mt-ss">
                            Lanjutkan
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Payment;