import React from 'react'
import store from 'store'
import $ from 'jquery';
import EventDetail from './Detail'
import { QueryParam, API_EVENT_BASE_URL, FormatPrice, CheckAuth, FormatDateIndo, FormatTime , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Tabs, Tab, Button, Modal, Table, Icon } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import GoogleMapReact from 'google-map-react';
import Sticky from 'react-sticky-el';
import EventConstants from './Constants';

class EventOrderConfirmation extends EventDetail {

	constructor(props) {
	    super(props);
      super.checkLogin(props);
	}

  componentDidMount() {
    super.componentDidMount();

    let orderData = store.get(`order_${this.state.uuid}`);

    if (!orderData) {
      this.props.history.push(`/event/${this.state.uuid}/order`);
    }

    this.setState({order_data : orderData});
  }

  render() {
  		var data = this.state.data;

  		if (!data) {
  			return super.render();
  		}

  		let orderData = this.state.order_data;

  		return (
  			<div className="container mt-m-l">
          <div className="bg-white pad-l pad-m mb-m shadowed">
            <Row className="mb-0">
              <Col s={2}><img className="logo-medium" src={BASE_URL + "/img/logo-paytren-small.png"} /></Col>
              <Col className="mb-s" m={5} s={10}><h5>{data.title}</h5>
                {super.getEventInfo(data)} 
                Terima Kasih. Pembayaran Anda di Skydu Indonesia telah diterima sejumlah : <br/><br/>
                <div className="box_info center-align">
                  <span className="h5 font-orange">{ FormatPrice(orderData.payment_amount)}</span>
                </div>
                <ul className="checklist">
                <li>Tiket Anda sudah tersimpan di <Link className="font-orange" to="/profile">List Tiket Saya</Link></li>
                {data.type == EventConstants.TYPE_BUNDLE &&
                  <li>Bonus course Anda sudah tersimpan di <Link className="font-orange" to="/profile">List Course Saya</Link></li>
                }
                </ul>
              </Col>
              <Col m={5} s={12} className="offset-s0">  
                <div className="bg-grey pad-m">
                  <h5 className="font-orange">Akademia : {CheckAuth().nama}</h5>
                  Invoice Number : <b>{orderData.invoice_number}</b><br/>
                  Tanggal Transaksi : <b>{orderData.created_at}</b><br/>
                  {orderData.cashback_amount > 0 && <span>Cashback : <b>{FormatPrice(orderData.cashback_amount)}</b><br/></span>}
                  Bonus PAC : <b>+{data.pac_point}PAC</b><br/>
                </div>
              </Col>
            </Row>
          </div>
          <div className="center mb-m">
            <Link className="btn" to="/profile">LIHAT TIKET SAYA</Link>
          </div>
        </div>
  		)
	}
}
export default EventOrderConfirmation