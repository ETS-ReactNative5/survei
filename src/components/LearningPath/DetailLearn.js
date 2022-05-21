import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_JOURNEY_BASE_URL, CheckAuth, FormatPrice , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Button, Icon } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import Slider from 'react-slick'
import Waypoint from 'react-waypoint';
import PaymentModal from '../Payment/Modal'
import {LearningPathItem} from './Catalog'
import {trans} from '../Lang';
import FontAwesome from 'react-fontawesome';
import { ic_rabat, ic_score } from '../../assets';
import { IconText } from '../Reuseables/MiniComponents';
import '../../styles/lp-detail.css';

class LearningPathDetail extends Page {

	constructor(props) {
		super(props);
		this.state = {
	      data: null,
	      uuid: props.match.params.uuid,
	    };
	}

	componentDidMount() {
		this.handleLoadData();
	}

	componentWillReceiveProps(props) {
		let uuid = props.match.params.uuid;
	    this.setState({uuid : uuid, data : null});
	    this.handleLoadData(uuid);
	}

	handleLoadData(uuid) {
		let dummyLearningPath = {
			uuid: "a2c7def6-8f74-4edb-910d-99bbece18261",
			title: "Marketing",
			categories: [
				{
					id: 69,
					name: "Social Media"
				},
				{
					id: 69,
					name: "Design"
				},
			],
			description: "mencoba",
			instructors: [
				{
					name: "Andika Amri",
					title: "Coach",
					avatar_url: BASE_URL + "/img/avatar.png",
				},
				{
					name: "Yahya Muhammad",
					title: "Coach",
					avatar_url: BASE_URL + "/img/avatar.png",
				},
			],
			thumbnail: "../../img/white-label/pictures/img_quote01.png",
			total_duration: "06:19:22",
			total_pdf_pages: 0,
			total_pac_point: 152,
			total_price: 215000,
			discount: 20,
			price: 172000,
			total_discount: 43000,
			put_total_price: 215000,
			put_price: 172000,
			completed: false,
			followed: true,
			enrolled: true,
			score: 880,
			user_cashback: 0,
			community_redeemable: false,
			courses: [
				{
					uuid: "8737ec24-e761-4921-afb5-55f29e3531f1",
					title: "Digital Marketing",
					instructor: "Andika Amri",
					price: 100000,
					thumbnail: "../../img/white-label/pictures/img_quote01.png",
					enrolled: false,
					best_seller: false,
					completed: false,
				},
				{
					uuid: "8737ec24-e761-4921-afb5-55f29e3531f1",
					title: "Social Media",
					instructor: "Yahya Muhammad",
					price: 100000,
					thumbnail: "../../img/white-label/pictures/img_quote01.png",
					enrolled: false,
					best_seller: false,
					completed: false,
				},
				{
					uuid: "8737ec24-e761-4921-afb5-55f29e3531f1",
					title: "UI/X Design",
					instructor: "Dian Martiandani",
					price: 100000,
					thumbnail: "../../img/white-label/pictures/img_quote01.png",
					enrolled: false,
					best_seller: false,
					completed: false,
				},
				{
					uuid: "8737ec24-e761-4921-afb5-55f29e3531f1",
					title: "Graphic Design",
					instructor: "Andika Amri",
					price: 100000,
					thumbnail: "../../img/white-label/pictures/img_quote01.png",
					enrolled: false,
					best_seller: false,
					completed: false,
				},
				{
					uuid: "8737ec24-e761-4921-afb5-55f29e3531f1",
					title: "Engagement Audience",
					instructor: "Yahya Muhammad",
					price: 100000,
					thumbnail: "../../img/white-label/pictures/img_quote01.png",
					enrolled: false,
					best_seller: false,
					completed: false,
				},
			],
			communities: [],
			bonus_item: null,
		}

		this.setState({ data: dummyLearningPath });
		// $.getJSON(API_JOURNEY_BASE_URL + "/" + (uuid || this.state.uuid) )
		// 	.then((data) => {
		// 		console.log("LEARNING PATH DATA >>> ", data);
		// 		this.setState({ data: data.payload });
		// 	});
	}

	handleFollow = () => {
		$.post(API_JOURNEY_BASE_URL + "/" + this.state.uuid + "/follow")
		.then((result) => {
			if(result.status = "success") {
				var data = this.state.data;

				data.followed = result.payload.followed;
				this.setState({data: data});
			}
		});
	}

	render() {
		var data = this.state.data;

		if(data) {
			var listCategory = data.categories.map((category, i) =>
				<Link to={`/course/catalog?category_id=${category.id}`}>{i != (data.categories.length - 1) ? <div className="lp-detail-ctg mb-xs mr-xs left">{category.name}</div> : <span className="lp-detail-ctg mb-xs mr-xs left">{category.name}</span>} </Link>);

			var listInstructor = <div></div>;
			if (data.instructors.length) {
		       listInstructor = data.instructors.map((instructor) =>
		       	<div className="section-item">
		       	    <div className="bg-white pad-s"><Image captions={<div className=""><Icon className="left" small>school</Icon> instructor</div>} height={185} width={163} className="medium circle center bg-white" src={instructor.avatar_url} /></div>
		            <div className="pad-s bg-white">
		              <div className="h5 center">{instructor.name}</div>
		            </div>
		          </div>
				);
		    }

			var settings = this.props.settings;
		    var slidesToShow = 6;

		    if (!settings && data.instructors.length > 6) {
		      settings = {
		        arrows : true,
		        speed: 300,
		        slidesToShow: slidesToShow,
		        slidesToScroll: slidesToShow,
		        infinite : false,
		        responsive: [
		          {
		            breakpoint: 1024,
		            settings: {
		              slidesToShow: slidesToShow - 1,
		              slidesToScroll: slidesToShow - 1,
		              infinite: false,
		              dots: true
		            }
		          },
		          {
		            breakpoint: 600,
		            settings: {
		              slidesToShow: 3,
		              slidesToScroll: 3
		            }
		          },
		          {
		            breakpoint: 480,
		            settings: {
		              slidesToShow: 2,
		              slidesToScroll: 2,
		              variableWidth: false,
		              infinite: false,
		              dots: true
		            }
		          }
		          // You can unslick at a given breakpoint now by adding:
		          // settings: "unslick"
		          // instead of a settings object
		        ]
		      };
		    } else if (!settings && data.instructors.length <= 6) {
		      settings = {
		        arrows : false,
		        speed: 300,
		        slidesToShow: slidesToShow,
		        slidesToScroll: slidesToShow,
		        infinite : false,
		        responsive: [
		          {
		            breakpoint: 1024,
		            settings: {
		              slidesToShow: slidesToShow - 1,
		              slidesToScroll: slidesToShow - 1,
		              infinite: false,
		              dots: true
		            }
		          },
		          {
		            breakpoint: 600,
		            settings: {
		              slidesToShow: 2,
		              slidesToScroll: 2
		            }
		          },
		          {
		            breakpoint: 480,
		            settings: {
		              slidesToShow: 1,
		              slidesToScroll: 1,
		              variableWidth: false,
		              infinite: false,
		              dots: true
		            }
		          }
		          // You can unslick at a given breakpoint now by adding:
		          // settings: "unslick"
		          // instead of a settings object
		        ]
		      };
		    }

		    var countCompletedCourses = 0;
		    for(var i = 0; i < data.courses.length; i++) {
		    	if(data.courses[i].completed) countCompletedCourses++;
		    }
		}

		return <div>
			<div className="background-title">
				<div className="container narrow ">
					{data && <span className="font-white left font-medium valign-wrapper pad-s hide"><Link to={`/`}><Icon small className="icon-course">home_material</Icon></Link>&emsp;<Icon small className="icon-course">keyboard_arrow_right_material</Icon>&emsp;<Link to={`/learning-path/catalog`}>{trans.learning_path}</Link>&emsp;<Icon small className="icon-course">keyboard_arrow_right_material</Icon>&emsp;{data.title}</span> }
				</div>
			</div>
			<div className="bg-white shadowed container narrow mb-m-l">
				<Row>
					<Col m={8} s={12} className="pad-m border-right">
					<Row>

						<Col m={4} s={12}>
							<div>
								{data && <Image src={data.thumbnail} className="square-responsive full relative mb-s" />}


							</div>
						</Col>
						<Col m={8} s={12}>
							<div className="almost-full centered">
								<h4 className="mb-s">{data && data.title}</h4>

								<div className="font-grey mb-s row">
									{data && !data.followed && <span className="valign-wrapper left mr-xs"><Icon tiny className="icon-course">book_material</Icon> <span className="padl-xs">{data.courses.length} {trans.course_item}</span></span> }
									{data && CheckAuth() && data.followed && <span className="valign-wrapper left mr-xs" className="valign-wrapper"><Icon tiny className="icon-course">book_material</Icon> <span className="padl-xs">{countCompletedCourses}/{data.courses.length} {trans.course} Diselesaikan</span></span> }

									{data && <span className="valign-wrapper left mr-xs"> <Icon tiny className="icon-course">timer_material</Icon> <span className="padl-xs">Total Durasi {data.total_duration}</span></span> }

									{data && data.total_pdf_pages > -1 && <span className="valign-wrapper left mr-xs"> <Icon tiny className="icon-course">picture_as_pdf</Icon> <span className="padl-xs">Total {data.total_pdf_pages} halaman PDF</span></span> }
								</div>
								<Row className="mb-s">
								{listCategory && data.categories.length > 0 && <div>{listCategory}</div>}
								</Row>



							</div>
						</Col>
						<Col m={12} s={12}>

							{data && <div className="font-grey justify mt-ss mb-s" dangerouslySetInnerHTML={{__html: data.description}}></div> }
						</Col>
					</Row>
					</Col>


					{data &&
					<Col m={4} s={12} className="pad-m border-left">
						<div className="mt-xs">
							{!data.enrolled && <div>
								<h5 className="mb-s">{trans.bundle} {trans.learning_path}</h5>

								<div className="strong font-grey mb-s">Dapatkan harga lebih murah dengan membeli {trans.bundle} {trans.learning_path}</div>
								<Row>
								<h5 className="font-black mb-s valign-wrapper left mr-xs">
				                    {data.price > 0 ? FormatPrice(data.price ) : "GRATIS"}

			                    </h5>

			                    {data.total_price > 0 && data.total_price > data.price && <b className="font-grey strike">{FormatPrice(data.total_price)}</b> }

			                    </Row>

								{data.bonus_item && <div>
									<h5 className="mt-s">Bonus</h5>
									<div className="strong font-grey mb-s">Beli dengan {trans.bundle} bonus {trans.learning_path} berikut:</div>

									<LearningPathItem className="section-card-small" data={data.bonus_item} />
								</div>
								}



							</div>
							}

							{data.enrolled && <div>
								<div className="font-orange mb-s">Anda sudah membeli {trans.learning_path} ini</div>
								<h5>Klaim Sertifikat</h5>

								<div className="strong font-grey mb-s">
								{data.completed ? "Selamat, Anda telah menyelesaikan " + trans.learning_path + " ini. Silakan klaim sertifikat Anda dengan menekan tombol di bawah" : "Segera selesaikan " + trans.learning_path + " ini untuk mendapatkan sertifikat."}
								</div>

								{data && CheckAuth() && data.completed == false && <div><Link to={`/#`} className="btn full disabled font-medium-large">LIHAT SERTIFIKAT</Link></div> }
								{data && CheckAuth() && data.completed == true && <div><Link to={`/learning-path/${data.slug}/certificate`} className="btn full font-medium-large">LIHAT SERTIFIKAT</Link></div> }
							</div>
							}



						</div>
					</Col>
					}
				</Row>
			</div>
			{ data && data.courses.length > 0 && <div className="container narrow mt-ss pad-m-s">
				<Row className="">
					<Col m={12}>
						<div className="badge badge-icon left center valign-wrapper mr-sm"><FontAwesome name="graduation-cap" /></div>
						{data && <h5 className="left mt-xxs"><b>{data.courses.length} {trans.course_item} Tersedia</b></h5> }
						{data && <span className="left font-grey ml-xs mt-xxs">Total Durasi {data.total_duration}</span>}
					</Col>
				</Row>
				<hr className="strong vertical"/>
				{data && data.courses.length > 0 && data.courses.map((item, i) =>
							<CourseItem data={item} index={i+1} size={data.courses.length} />
							)}
				<hr className="strong vertical mt-min-s"/>
				<Row className=" mt-s mb-m-l">
					<Col m={12}>
						<div className="badge badge-icon left center valign-wrapper mr-sm"><FontAwesome name="star" /></div>
						{data && <h5 className="left mt-xxs"><b>Dapatkan Sertifikat</b></h5> }
					</Col>
					<br/><br/>
					{data && <div className="padl-l font-grey">Setelah menyelesaikan semua {trans.course} dalam {trans.learning_path} ini, Anda akan mendapatkan sertifikat khusus</div>}
				</Row>
			</div> }
			{ data && data.instructors.length > 0 && <div className="container narrow mb-m pad-m-s">
				<h5 className="left">{trans.lecturer} Dalam {trans.learning_path} Ini</h5>
				<br/>
				<div className="section mt-xss">
			      { listInstructor && <Slider {...settings}>{ listInstructor }</Slider> }
			    </div>
			</div> }

			{data && <PaymentModal itemType="learningPath" title={`Beli Paket`} item={data} />}
		</div>
	}
}

class CourseItem extends React.Component {

	render() {
		let data = this.props.data;
		let num = this.props.index;
		let className = this.props.className;
		let size = this.props.size;

		return (
			<div>
				<div className="valign-wrapper  mt-min-m">
					<div className="size-24 mr-sm">
						{data.completed == false && <div className="badge left center lh-50">{num}</div> }
						{data.completed == true && <div className="left valign-wrapper check-icon-div"><i className="material-icons icon-course center valign-wrapper" >check_circle</i></div> }
					</div>
					<div className="full">
						<Link to={`/course/${data.slug}`}>
							<div className={className || "bg-white pad-m section-card hoverable"}>
								<Image src={data.thumbnail} className="square" />
								<div className="content">
							    	<div className="right font-grey mb-s hide"><Icon>share</Icon></div>
							    	<h5 className="ellipsis hidden-overflow">{data.title}</h5>
							    	<div className="font-grey mb-s">{data.instructor}</div>
				            		<div className="mb-s font-orange font-medium">{data.price == 0 ? 'FREE' : FormatPrice(data.price)}</div>
					    		</div>
							</div>
						</Link>
					</div>
				</div>
				{num != size && <hr className="strong vertical-large mt-min-s"/> }
			</div>
		)
	}
}

export default LearningPathDetail
export {CourseItem}
