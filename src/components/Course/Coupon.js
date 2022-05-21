import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_COUPON_BASE_URL, FormatPrice, CheckAuth, FormatDateIndo, FormatTime , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Tabs, Tab, Button, Icon } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {trans} from '../Lang';
import { pa_green } from '../../assets';
import '../../styles/course-coupon-detail.css';

class CourseCoupon extends Page {

	constructor(props) {
	    super(props);
	    this.state = {data: "", uuid : props.match.params.uuid};
	}

	componentDidMount() {
	    this.handleLoadData();
	}

  handleLoadData = (e) => {
		$.getJSON(API_COUPON_BASE_URL + "/" + this.state.uuid)
	      .then((data) => {
	        this.setState({ data: data.payload });
	    });
  }

  render() {
    let { data } = this.state;
	let { course } = data;
	let screen_width = $(window).width();

	const pac_info = <div>
										<div className="valign-wrapper inline-block">
											<img className="course-card-pac-icon" src={pa_green}/>
										</div>
										<div className="valign-wrapper inline-block">
											<span className="course-card-pac-text">{course && course.pac_point} PAC</span>
										</div>
					</div>

  	if (!data) {
  		return super.render();
  	}

  	return (
      <div>
        <div className="bg-orange pad-l">
    		  <div className="container-medium pad-m-s">
            <h4 className="font-white">Detail Kupon {data.course_title}</h4>
            <div className="font-white"> Order No {data.invoice_number} Pada {FormatDateIndo(data.created_at)}</div>
          </div>
        </div>

        <div className="bg-white center pad-m pad-l border-bottom">
         {/* <img className="mb-m" src={BASE_URL + "/img/profile/ic-coupon.png"} />
          <h4 className="font-light">Kode Kupon Anda untuk {trans.course_item} ini</h4>
          <h5 className="font-light font-grey mb-s">Copy dan paste kode di bawah ini melalui chat, email, atau sms</h5>
          <div className="wide-400">
                        <h5 className="mt-m mb-m">Sisa kuota kupon&nbsp; </h5>
          </div>*/}
		  <Link to={"/course/" + course.uuid}>
			  <div className="wide-center">
				  <div className="section-card border-bottom course-detail-coupon">
						  <div>
						  	<Image src={course.thumbnail} className="square coupon-item-image" />
							<div className="content" id="coupon-content">
								<Row>
								  <Col l={8} m={8} s={12} className="text-left" id="course-info-div">
									{ screen_width >= 805 && pac_info }
								  	<h5 className="font-heavy">{course.title}</h5>
									<span className="font-thick-gray" id="course-coupon-instructor">{course.instructor}</span>
								  </Col>
								  <Col l={3} m={3} s={12} id="coupon-price-div">
									  <i className="material-icons font-orange right" id="coupon-price-chevron">chevron_right</i>
									  <h5 className="font-heavy font-orange" id="coupon-price">{FormatPrice(course.price * 1.3)}</h5>
									  { screen_width < 805 && pac_info }
									  <br/>
								  </Col>
							  </Row>
					  	  	</div>
					      </div>
				   </div>
			  </div>
	  	  </Link>
		  <br/>
	  	  <Row className="wide-center">
			  <Col s={12} m={8} l={9}>
				  <h5 className="text-left font-heavy">Kode Kupon</h5>
				  <div className="bg-grey border-all h4 mb-s" id="coupon-code-box">{data.code}</div>
			  </Col>
			  <Col s={12} m={4} l={3}>
				  <h5 className="text-right font-thick-gray">Sisa Kuota Kupon <span className="font-orange "><b>{data.quota - data.used_count}</b></span> </h5>
				  <CopyToClipboard text={data.code}
              		onCopy={() => notify.show("Copied to clipboard", "success")}>
              		<a className="copy-btn btn full">Salin Kode</a>
            	  </CopyToClipboard>
			  </Col>
		  </Row>
		  <div className="wide-center" id="coupon-info">
		  		<p className="font-thick-gray text-left">Kode kupon dapat digunakan untukmu ataupun orang lain</p>
		  </div>
        </div>
  		</div>
  	)
	}
}
export default CourseCoupon
