import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from './Page'
import { QueryParam, API_PROFILE_BASE_URL, FormatPrice, CheckAuth, FormatDateIndo } from './Util'
import { Row, Col, ProgressBar, Input, Tabs, Tab, Icon, Modal, Button } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from './Image';

class Profile extends Page {
	constructor(props) {
	    super(props);
	    this.state = {data: null, enrolled_courses : null, completed_courses : null, favourite_courses : null, events_ticket : null, coupons : null};
	}

	componentDidMount() {
	    this.handleLoadData();
	}

  	handleLoadData = (e) => {
	    $.getJSON(API_PROFILE_BASE_URL)
	      .then((data) => {
	        this.setState({ data: data.payload });

	        let promoKey = "promo_seen_" + data.payload.uuid;
	        let isPromoSeen = store.get(promoKey);

	        if (data.payload.voucher_deposit > 0 && !isPromoSeen) {
	        	$("#promo-btn").trigger("click");
	        	store.set(promoKey, true);
	        }

	    });

	    $.getJSON(API_PROFILE_BASE_URL + "/course/enrollment")
	      .then((data) => {
	        this.setState({ enrolled_courses : data.payload });
	    });

	    $.getJSON(API_PROFILE_BASE_URL + "/course/completed")
	      .then((data) => {
	        this.setState({ completed_courses: data.payload });
	    });

	    $.getJSON(API_PROFILE_BASE_URL + "/events/ticket")
	      .then((data) => {
	        this.setState({ events_ticket: data.payload });
	    });

	    $.getJSON(API_PROFILE_BASE_URL + "/coupon/list")
	      .then((data) => {
	        this.setState({ coupons: data.payload });
	    });
	}


  	render() {
  		var data = this.state.data;

  		if (!data) {
  			return super.render();
  		}

  		data.enrolled_courses = this.state.enrolled_courses;
  		data.favourite_courses = this.state.favourite_courses;
  		data.completed_courses = this.state.completed_courses;
  		data.events_ticket = this.state.events_ticket;
  		data.coupons = this.state.coupons;

  		console.log("TICKET >>> ", data.events_ticket);

  		return <Row className="container pt-m-l narrow mb-xl">

  			<Col className="bg-white offset-m1" m={10} s={12}>
	  			<div className="pad-m bg-maroon font-white">
	  				<div className="bg-academia pad-m">
	  					<Row className="mb-0">
	  						<Col className="mb-m" s={12}>
			  					<img src={CheckAuth().foto} className="right small circle mr-s" />
			  					<img className="left" src={BASE_URL + "/img/logo-grey.png"} />
	  						</Col>
	  						<Col l={7} s={12}>
	  							<h4 className="font-white">{data.name}</h4>
	  							<div className="capitalize">{data.username}</div>
	  						</Col>
	  						<Col className="pt-s align-right" l={5} s={12}>
	  							<div className="pr-s inline">
		  							<div className="align-right font-tiny">Poin Academy &nbsp;</div>
		  							<div className="border-white strong center valign-wrapper">
		  							<img src="img/ic_pac.png"} />
		  							<span className="padl-s">{data.total_pac} PAC</span></div>
	  							</div>
	  							<div className="inline">
		  							<div className="align-right font-tiny">Poin Belajar Akademia &nbsp;</div>
		  							<div className="border-white strong center valign-wrapper"><Icon className="tiny">card_membership</Icon><span className="padl-s">
		  								{FormatPrice(data.voucher_primary)} <span className="font-orange">({FormatPrice(data.voucher_deposit)})</span>
		  							</span></div>
	  							</div>
	  						</Col>
	  					</Row>

	  				</div>
	  			</div>

	  			<Tabs className="no-shadow">
	                <Tab title="Course Saya">
	                	{}

						{data.enrolled_courses && data.enrolled_courses.map((course, i) =>
							<Link to={`/course/${course.uuid}`}>
							<div className="hoverable pad-m section-card border-bottom">
								<Image src={course.thumbnail} className="square" />
								<div className="content">
									<h5>{course.title}</h5>
									Oleh : {course.instructor}
								</div>
							</div>
							</Link>
			            )}

			            {data.enrolled_courses==null && super.getLoadingMedium()}

			            {!data.enrolled_courses.length &&
			            	<div className="pad-xl center">
			            		<img src="img/profile-course-empty.png"} />
			            		<div className="strong font-grey mt-s">Meja Belajar Anda masih kosong</div>
			            	</div>

			            }
			        </Tab>
			        <Tab className="hide" title="Course Favorit">
						{data.favourite_courses && data.favourite_courses.map((course, i) =>
							<Link to={`/course/${course.uuid}`}>
							<div className="hoverable pad-m section-card border-bottom">
								<Image src={course.thumbnail} className="square" />
								<div className="content">
									<h5>{course.title}</h5>
									Oleh : {course.instructor}
								</div>
							</div>
							</Link>
			            )}

			            {data.favourite_courses==null && super.getLoadingMedium()}

			            {!data.favourite_courses.length &&
			            	<div className="pad-xl center">
			            		<img src="img/profile-favorite-empty.png"} /><br/><br/>
			            		<div className="strong font-grey">Belum ada course yang Anda simpan</div>
			            	</div>

			            }
			        </Tab>
			        <Tab title="Course Lulus">
						{data.completed_courses && data.completed_courses.map((course, i) =>
							<Link to={`/course/${course.uuid}/recap`}>
							<div className="hoverable pad-m border-bottom">
								<h5 className="right font-orange"><span className="font-grey">Nilai : </span> {course.final_grade}%</h5>
								<div className="content">
									<h5>{course.title}</h5>
									Oleh : {course.instructor}
								</div>
							</div>
							</Link>
			            )}

			            {data.completed_courses==null && super.getLoadingMedium()}

			            {!data.completed_courses.length &&
			            	<div className="pad-xl center">
			            		<img src="img/img_sertifikat.png"} /><br/><br/>
			            		<div className="strong font-grey">Belum ada course yang lulus</div>
			            	</div>

			            }
			        </Tab>

			        <Tab title="Tiket Saya" className="">
						{data.events_ticket && data.events_ticket.map((ticket, i) =>
							<Link to={`/event/${ticket.uuid}/ticket`}>
							<div className="hoverable pad-m section-card border-bottom">
								<Image src={ticket.image_url} className="square" />
								<div className="content">
									<h5>{ticket.title}</h5>
									<div className="mb-s valign-wrapper"><Icon className="left" tiny>event</Icon> {FormatDateIndo(ticket.	held_at, false, true)} </div>
									<div className="strong">Dibeli pada {FormatDateIndo(ticket.purchased_at)} Booking Code {ticket.booking_code} </div>
								</div>
							</div>
							</Link>
			            )}

			            {data.events_ticket==null && super.getLoadingMedium()}

			            {!data.events_ticket.length &&
			            	<div className="pad-xl center">
			            		<img src="img/img_ticket_empty.png"} /><br/><br/>
			            		<div className="strong font-grey">Belum ada tiket yang dipesan.<br/>Pesan tiket untuk event yang Anda suka</div>
			            	</div>

			            }
			        </Tab>
					<Tab title="Kupon Saya" className="">
						{data.coupons && data.coupons.map((coupon, i) =>
							<CouponItem data={coupon} />
			            )}

			            {data.coupons==null && super.getLoadingMedium()}

			            {!data.coupons.length &&
			            	<div className="pad-xl center">
			            		<img src="img/profile/img-kupon-empty.png"} /><br/><br/>
			            		<div className="strong font-grey">Belum ada kupon course yang dibeli</div>
			            	</div>

			            }
			        </Tab>
		       </Tabs>
  			</Col>
  			<Modal trigger={
            <Button id="promo-btn" className="hide">SUBMIT</Button>
	          }>
	          <div className="center almost-full">
	          	<img className="mb-s" src={BASE_URL + "/img/ic_prize.png"} />
	            <h4 className="font-light">Selamat!</h4>

	            <div className="mb-m">
	            Anda mendapatkan poin belajar senilai Rp 300.000 untuk mendaftar di course Skydu Indonesia #OktoberBahagia
	              </div>
	              <a className="btn modal-close capitalize btn-outline">Oke</a>

	            </div>
	        </Modal>
  		</Row>
	}
}

class CouponItem extends React.Component {

  render() {
    let data = this.props.data;
    let quota = data.quota ? data.quota - data.used_count : null;

    return (
    	<Link to={`/coupon/${data.uuid}`}>
	    	<div className="hoverable pad-m section-card border-bottom">
	    	<Image src={data.course_image} className="square" />
		    	<div className="content">
		    		<div className="font-tiny font-grey strong valign-wrapper mb-xs"><Icon tiny>card_giftcard</Icon>
		    			<span>
		    				&nbsp;Kupon Course
		    				{data.qty > 0 && <span> x {data.qty}</span>}
		    			</span>
		    		</div>
		    		<h5>{data.course_title}</h5>
		    		<div>{data.course_instructor || "Ust Yusuf Mansyur"}</div>
		    		{quota && <div className="mt-xs right-align">Sisa Kuota Kupon :
		    			<span className="font-orange strong">{data.quota - data.used_count}</span>
		    		</div>}
		    	</div>
	    	</div>
    	</Link>
    )
  }
}

export default Profile
export {CouponItem}
