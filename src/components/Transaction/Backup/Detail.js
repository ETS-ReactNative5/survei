import React from 'react'
import store from 'store'
import $ from 'jquery';
import { QueryParam, API_TRANSACTION_HISTORY, FormatPrice, CheckAuth, FormatDateIndo, FormatTime } from '../Util'
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

class TransactionDetail extends Page {

	constructor(props) {
	    super(props);

      this.state = {data: null, invoice_number : props.match.params.invoice_number};
	}

  componentDidMount() {
    super.componentDidMount();
    this.handleLoadData();
  }

  handleLoadData() {
      $.getJSON(API_TRANSACTION_HISTORY + "/" + this.state.invoice_number)
        .then((data) => {   
          this.setState({ data: data.payload });
      });
  }

  render() {
  		var data = this.state.data;

      if (!data) {
        return super.render();
      }

      data.price = data.payment_amount / (data.quantity || 1);

      if (data.payment_method == TransactionConstants.PUT) {
        data.price = data.put_payment_amount / (data.quantity || 1);
      }

      let itemLabel = TransactionConstants.label(data.purchasable_type);
      let itemType = "";

      if (itemLabel == trans.course) {
          itemType = "course";
      } else if (itemLabel == trans.learning_path) {
          itemType = "learning-path";
      } else {
          itemType = itemLabel.toLowerCase().replace(" ", "-");
      }

      
      let isCoupon = data.purchasable_type == TransactionConstants.TYPE_COUPON;

  		return (
  			<div className="bg-white">
          <div className="center mb-m pt-m">
            <img src="../img/course/ic_checklist.png" />
            <h4 className="mt-s">{data.payment_amount > 0 ? "Transaksi Anda Berhasil" : "Pendaftaran Anda Berhasil"}</h4>
            <div className="font-grey h5 font-light">{itemLabel} Anda telah tersimpan di profil</div>
          </div>
          <div className="container-medium">
            <Row>
              <Col s={12} m={6}>
                <div className="almost-full pad-m-s">
                  <h5>Item</h5><hr className="strong" />
                  <PurchasedItem data={data} />
                  <hr/>
                  <h4 className="mb-0"><span className="font-orange right">{data.payment_method == TransactionConstants.PUT ? `${data.put_payment_amount} PUT` : FormatPrice(data.payment_amount)}</span>Total</h4>
                  <hr className="strong" />
                </div>
              </Col>

              <Col s={12} m={6}>
                <div className="almost-full pad-m-s">
                  <h5>Detail Transaksi</h5><hr className="strong" />

                  <table className="narrow">
                    <tr>
                      <td>Akademia</td><td width="30px">:</td><td className="strong">{CheckAuth().nama}</td>
                    </tr>
                    <tr>
                      <td>Invoice Number</td><td width="30px">:</td><td className="strong">{data.invoice_number}</td>
                    </tr>
                    <tr>
                      <td>Tanggal Transaksi</td><td width="30px">:</td><td className="strong">{FormatDateIndo(data.created_at)}</td>
                    </tr>
                    {false && data.cashback_amount > 0 &&
                      <tr>
                        <td>Cashback</td><td width="30px">:</td><td className="strong">{FormatPrice(data.cashback_amount)}</td>
                      </tr>
                    }
                  </table>
                  
                </div>
              </Col>
            </Row>
          </div>
          <div className="center mb-m wide-300">
            <br/><br/>
            {isCoupon && <Link className="btn full capitalize" to={`/coupon/${data.purchasable_uuid}`}>Lihat {itemLabel}</Link>}
            {!isCoupon && <Link className="btn full capitalize" to={`/${itemType}/${data.purchasable_uuid}`}>Mulai {itemLabel}</Link>}       
          </div>
          &nbsp;
        </div>
  		)
	}
}

class PurchasedItem extends React.Component {

  render() {
    let data = this.props.data
    let isCoupon = data.purchasable_type == TransactionConstants.TYPE_COUPON;
    let qty = data.quantity || 1;
    let url = `/course/${data.purchasable_uuid}`;

    if (isCoupon) {
      url = `/coupon/${data.purchasable_uuid}`;
    }

    return (
      <Link to={url}>
        <div className={"bg-white mb-s section-card small"}>
          <Image src={data.purchasable_image} className="small" />
          <div className="content">
            <h5><b className="font-orange right ml-m">{data.payment_method == TransactionConstants.PUT ? `${data.put_payment_amount} PUT` : FormatPrice(data.price)}</b></h5>
            {isCoupon &&
              <div className="font-tiny font-grey strong valign-wrapper mb-xs"><Icon tiny>card_giftcard</Icon>
                <span>
                  &nbsp;Kupon Course x {qty}
                </span>
              </div>
            }
            
            <h5 className="padr-s"><b>{data.purchasable_title}</b></h5>

            {data.purchasable_instructor &&
              <span className="font-small"><br/>{data.purchasable_instructor}</span>
            }
          </div>        
        </div>
      </Link>
    )
  }
}

export default TransactionDetail