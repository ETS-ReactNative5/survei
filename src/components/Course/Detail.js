import $ from "jquery";
import React from "react";
import FontAwesome from "react-fontawesome";
import ReactHtmlParser from "react-html-parser";
import { Button, Col, Collapsible, CollapsibleItem, Collection, CollectionItem, Icon, Input, Modal, Row, Tab, Tabs } from "react-materialize";
import { notify } from "react-notify-toast";
import ReactPlayer from "react-player";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { ShareButtons } from "react-share";
import StarRatings from "react-star-ratings";
import YouTube from "react-youtube";
import ReactTooltip from "simple-react-tooltip";
import store from "store";
import { check, play } from "../../assets";
import "../../styles/course-detail.css";
import "../../styles/course-rating-modal.css";
import Image from "../Image";
import { alert, trans } from "../Lang";
import Page from "../Page";
import VideoPlayer from "../Reuseables/VideoPlayer";
import RatingModal from "../Reuseables/RatingModal";
import UserConstants from "../User/Constants";
import { API_COURSE_BASE_URL,API_WEBINAR_STATUS_COURSE_USER, API_UPLOAD_UPRAK, API_CHECK_UPRAK, API_DELETE_UPRAK, BASE_URL, CheckAuth, FormatDateIndo, FormatPrice, QueryParam, API_UJIAN_PRAKTEK, API_ABSEN_WEBINAR } from "../Util";
import BuyCourseButton from "./BuyCourseButton";
import CourseItem from "./CourseItem";
import LearningPathItem from "./LearningPathItem";
import * as rdd from 'react-device-detect';
import ProgressBar from './ProgressBar';
import "../../styles/removeyoutuberecomend.css";
import CKEditor from 'ckeditor4-react';


class CourseDetail extends Page {
	static TYPE_VIDEO = 1;
	static TYPE_AUDIO = 2;
	static TYPE_PDF = 3;
	static TYPE_QUIZ = 4;

	static COURSE_PLAYED = 1;
	static COURSE_PAUSED = 2;
	static COURSE_ENDED = 3;
	static COURSE_ERROR = 4;

	static ZOOM_STEP = 0.1;

	constructor(props) {
		super(props);
		this.timer = 0;
		this.state = {
			data: null,
			uuid: props.match.params.uuid,
			enrolling: props.match.params.enroll,
			redeem_coupon: CheckAuth().is_businessman === 0,
			content_rating: 0,
			media_rating: 0,
			benefit_rating: 0,
			comment: "",
			isPlaying:0,
			tipeResource:0,
			openModalVideo:false,
			isOpenModalVideo:false,
			eventState:null,
			timeRunning:0,
			countView:0,
			intervalStopVideo:0,
			isResourceTypeVideo:false,
			progressCourse: { bgcolor: "#fa0207", completed: 0,alldata:0,countComplete:0,uncompleted:0 },
			progressCount: { all: 0, completed: 0, uncompleted: 0 },
			countDownTimerPause:0,
			dataApi:[],
			datasubarr:[],
			filterIsVideoKuis:[],
			status_webinar:false,
			upload_uprak: false,
			have_upload_uprak: false,
			course_uuid: null,
			kuis_webinar: [],
			uploaded: [],
			completed: false,
			uprak: {
				is_passed: null,
				max_uploadfile: 0,
				max_file: false,
				score: 0,
			},
			delete_file_loading: false,
			rich_text_box: false,
			uprak_text: {
				title: '',
				text: '',
			},
			absent_code: '',
			errorAbsentCode: '',
			absent_loading: false,
			isFullScreen: false,
			link_materi:'',
			slug_kelas: ''
		};
	}

	async componentDidMount() {
		await this.handleLoadData(this.state.enrolling);
		window.addEventListener("resize", this.updateDimensions);
		super.componentDidMount();
		// this.handleLoadData(this.state.enrolling);
		setTimeout(function(){()=>this.raflesngln() }, 3000);
		$(".btn-help").hide();
		// {this.state.eventState ? ()=>this.hitungPersentase() : ''}
		window.addEventListener("blur", this.onFocus)
		
		var ini = this;

		window.addEventListener("fullscreenchange", function() {
			// console.log('bambang', state);
			ini.setState({isFullScreen: !ini.state.isFullScreen});
		 }, false);
	}

	componentDidUpdate(prevProps, prevState) {
		let activeTopic = this.state.topic;
		let { data } = this.state;
		let prevData = prevState.data;
		if (prevState.topic !== activeTopic) {
			prevState.topic.selected = false;
			activeTopic.selected = true;
			console.log("DATA ACTIVE TOPIC>>> ", activeTopic);
			this.setState({ topic: activeTopic },() => this.hitungPersentase());
		}
		if (prevState.timeRunning !== this.state.timeRunning) {
			// console.log("========================================================"+prevState.timeRunning+"======="+this.state.timeRunning+"========")
			if(this.state.isPlaying==1){
				  this.setState({
					timeRunning:this.state.eventState.target.playerInfo.currentTime
				  });
			}
		}
	}

	componentWillReceiveProps(props) {
		let params = QueryParam();
		let uuid = props.match.params.uuid;
		this.setState({ uuid: props.match.params.uuid, data: null },() => this.hitungPersentase());
		this.handleLoadData(this.state.enrolling, uuid);
	}

	updateDimensions = () => {
		this.setState({ width: $(window).width(), height: $(window).height() });
	};

	componentWillMount = function () {
		this.updateDimensions();
		setTimeout(function(){$("#btnTriggerProgressLoad").trigger("click"); }, 4000);
	};

	componentWillUnmount = function () {
		window.removeEventListener("resize", this.updateDimensions);
		window.removeEventListener("focus", this.onFocus)
	};
	
	onFocus = () => {
		let eventState=this.state.eventState;
		if(eventState !==null || eventState !=''){
			this.handleOpenModalVideo()
		}
	}



	handleLoadData = (enroll, uuid) => {
		
		// this.setState({dataApi:[]})
		uuid = uuid ? uuid : this.state.uuid;

		$.getJSON(API_COURSE_BASE_URL + uuid).then(data => {
			console.log("DATA API_COURSE_BASE_URL >>> ", data);
			this.setState({
				course_uuid: data.payload.uuid,
				completed: data.payload.completed,
				link_materi: data.payload.course_material,
				slug_kelas: data.payload.slug
			});
			this.loadStatusWebinnar(data.payload.uuid);
			let { payload } = data;
			var topicUuid = window.location.hash.substr(1);
			var topic = data.payload.modules[0].topics[0];
			var moduleIndex = 0;
			
			// let kuis_webinar = [];
			
			const modules_have_webinar = data.payload.modules.filter(module => module.description == 'CLASS_WEBINAR');

			for (let i in modules_have_webinar) {
				const webinar_quiz = modules_have_webinar[i].topics.filter(topic => topic.resource_type == CourseDetail.TYPE_QUIZ);

				if(webinar_quiz.length > 0) {
					// this.state.kuis_webinar.push(webinar_quiz);
					this.setState({
						kuis_webinar: [this.state.kuis_webinar, ...webinar_quiz]
					})
				}
			}
			
			// setTimeout(()=>{
				// 	this.setState({
					// 		kuis_webinar: kuis_webinar.flat()
					// 	});
			// },500)
			
			var isLogin = (CheckAuth() !== false);

			if (isLogin) {
				this.checkHaveUploadUprak();
			}

			if (topicUuid) {
				for (var i in data.payload.modules) {
					var topics = data.payload.modules[i].topics;
					for (var j in topics) {
						if (topicUuid == topics[j].uuid && !topics[j].locked) {
							topic = topics[j];
							moduleIndex = i;
							break;
						}
					}	
				}
			}
			
			if (topic) {
				topic.module_title = data.payload.modules[moduleIndex].title;
				topic.selected = true;
			}
			
			if (data.payload.voucher_redeemable) {
				data.payload.user_cashback = 0;
			}

			let alertSeen = store.get(this.getAlertKey());

			this.setState({
				data: data.payload,
				topic: topic,
				alert_seen: alertSeen,
				// dataApi:data.payload
			},() => this.hitungPersentase());

			$(".meta-title").attr("content", data.payload.title);
			$(".meta-image").attr("content", data.payload.thumbnail);
			$(".meta-description").attr("content", data.payload.description);

			// $("video").bind("contextmenu",function(){
			//   return false;
			// });
			
			if (enroll) {
				this.doEnroll();
			} else if (this.state.enrolling) {
				notify.show(
					`${trans.you} ${trans.successfully} ${trans.registered}`,
					"success"
				);
			}

			if (store.get(`completed_${uuid}`)) {
				store.remove(`completed_${uuid}`);
				$("#graduate-btn").trigger("click");
			}

		});
	};

	handleLinkMateri = (e) =>{
		window.open(`/materi/${this.state.slug_kelas}`, "_blank")
	}

	handleReset = () => {

		let param = {};
		
		$.post(API_UJIAN_PRAKTEK + this.state.course_uuid + '/reset', param)
		.then(data => {
			console.log(data)
			window.location.reload();
		})
		.fail((err) => {
			console.log(err);
		});
	}

	checkHaveUploadUprak = () => {
		let formData = new FormData();

		formData.append('uuid', this.state.course_uuid);

		$.ajax({
			url: API_CHECK_UPRAK,
			data: formData,
			type: 'POST',
			contentType: false, 
			processData: false,
		}).then((data) => {
			let max_file = false;

			if(data.payload.data.length >= data.payload.max_uploadfile) {
				max_file = true;
			}

			let is_passed;

			if(data.payload.is_passed == null) {
				is_passed = null;
			} else {
				is_passed = data.payload.is_passed.is_passed;
			}

			this.setState({
				uploaded: data.payload.data,
				uprak: {
					is_passed: is_passed,
					max_uploadfile: data.payload.max_uploadfile,
					max_file: max_file,
					score: data.payload.is_passed.score
				}
			});
		});
	}

	handleUploadUjianPraktek = (e) => {
		this.setState({
			upload_uprak: true
		});

		var file = e.target.files[0];

		let formData = new FormData();

		formData.append('file', file);
		formData.append('uuid', this.state.course_uuid);
		
		$.ajax({
			url: API_UPLOAD_UPRAK,
			data: formData,
			type: 'POST',
			contentType: false, 
			processData: false,
		}).then((data) => {
			this.setState({
				upload_uprak: false,
				have_upload_uprak: true,
			});
			this.checkHaveUploadUprak();
			notify.show('Upload berhasil', "success");
		}).catch((error) => {
			notify.show('Terdapat error pada file yang diupload', "danger");
		});
	}

	renderFileName = (filename) => {
		let extension = filename.split(".");
		extension = extension[extension.length - 1];

		let name = filename.split("_");

		name.pop();

		name = name.join('_');

		return name  + '.' + extension;
	}

	checkUprakLocked = (topic,index,index_completed) => {
		if(topic.title == 'UJIAN PRAKTEK') {
			return this.state.completed == true ? false : true;
		}else {
			if(topic.locked){
				return true;
			}else{ 
				if(topic.completed){
					return false;
				}else{
					if( index == index_completed || index==0){
						return false;	
					}else{
						let index_pdf = index + 1;
						if(topic.resource_type == CourseDetail.TYPE_PDF && index_pdf == index_completed){
							return false
						}else{
							return true;
						}
					}
				}
			}
		}
	}

	deleteFile = (file_id) => {
		this.setState({
			delete_file_loading: true
		});

		let formData = new FormData();

		formData.append('file_id', file_id);
		
		$.ajax({
			url: API_DELETE_UPRAK,
			data: formData,
			type: 'POST',
			contentType: false, 
			processData: false,
		}).then((data) => {
			this.setState({
				delete_file_loading: false,
			});
			this.checkHaveUploadUprak();
			notify.show('Hapus file berhasil', "success");
		}).catch((error) => {
			notify.show("Gagal menghapus file", "danger");
		});
	}

	renderUploadButton = () => {
		return (
			<div className="d-flex-jc-center wrapper-form-uprak mb-xss pt-s pb-s">
				<div className="mr-xs">
						<Modal
						id="rich-text-box-modal"
						className="rich-text-box-modal"
						trigger={<button className="btn capitalize btn-small">Ketik Ujian Praktek</button>}
						modalOptions={{ dismissible: false }}
						options={{
								endingTop: '10%',
								inDuration: 250,
								onCloseEnd: null,
								onCloseStart: null,
								onOpenEnd: null,
								onOpenStart: null,
								opacity: 0.5,
								outDuration: 250,
								preventScrolling: true,
								startingTop: '4%'
							}}
						>
							<div className="rich-text-title-wrapper">
								<label for="rich-text-title">Judul</label>
								<input name="rich-text-title" onChange={this.handleRichTextTitle} placeholder="Masukkan Judul" />
							</div>
							<div className="center almost-full rich-text-box-modal">
									{this.renderRichTextBox()}
							</div>
						</Modal>
				</div>
				<form id="form-upload-ujian-praktek" className="form-uprak ml-xs">
					<div id="upload_button">
						<label>
							<input name="file" onChange={this.handleUploadUjianPraktek} type="file" />
							<span className="btn capitalize btn-small">Upload Hasil Praktek Kamu</span>
						</label>
					</div>
				</form>
			</div>
		)
	}

	showRichTextBox = () => {
		this.setState({
			rich_text_box: !this.state.rich_text_box,
		});
	}
	
	renderRichTextBox = () => {
		return (
			<div>
				<CKEditor
                data={this.state.uprak_text.text}
				config={{
					removeButtons: 'Image,ImageButton,Link,Unlink,Cut,Copy,Paste,PasteText,PasteFromWord,Anchor'
				  }}
				onChange={this.handleChange}
            	/>
				<div className="d-flex-jc-center mt-xs mb-s">
					<button className="btn capitalize btn-small mr-xs modal-close" onClick={this.sendRichTextUprak}>Kirim</button>
					<button className="btn capitalize btn-small bg-danger modal-close">Cancel</button>
				</div>
			</div>
		)
	}

	handleChange = (evt) => {
        this.setState( {
            uprak_text: {
				text: evt.editor.getData(),
				title: this.state.uprak_text.title
			}
        } );
    }

	handleAbsentCodeChange = (e) => {
		let { value } = e.target;

		this.setState({
			absent_code: value
		})
	}

	submitAbsentCode = () => {
		let validate = this.validateAbsentCode();

		if(validate) {
			this.setState({ absent_loading: true })

			let formData = {
				course_uuid: this.state.course_uuid,
				kode: this.state.absent_code
			}

			$.post(API_ABSEN_WEBINAR, formData)
			.then((data) => {
				notify.show("Absensi berhasil. Silahkan melanjutkan kuis", 'success')
				$("#kode-absensi-modal-close").trigger("click")
				$(".modal-overlay").trigger("click")
				this.setState({ status_webinar: true, absent_loading: false })
			})
			.fail((data) => {
				notify.show(data.responseJSON.message, "warning")
				this.setState({ absent_loading: false })
			});
		}
	}

	validateAbsentCode = () => {
		let validate = true;
		let errorMessage = '';

		if(!this.state.absent_code) {
			errorMessage = "Kode Absen wajib diisi"
			validate = false;
		}

		this.setState({
			errorAbsentCode: errorMessage
		})

		return validate;
	}

	handleRichTextTitle = (e) => {
		this.setState({
			uprak_text: {
				title: e.target.value,
				text: this.state.uprak_text.text
			}
		})
	}

	sendRichTextUprak = () => {
		this.setState({
			upload_uprak: true
		});

		let formData = new FormData();

		formData.append('title', this.state.uprak_text.title);
		formData.append('text', this.state.uprak_text.text);
		formData.append('uuid', this.state.course_uuid);
		
		$.ajax({
			url: API_UPLOAD_UPRAK,
			data: formData,
			type: 'POST',
			contentType: false,
			processData: false,
		}).then((data) => {
			this.setState({
				upload_uprak: false,
				have_upload_uprak: true,
				uprak_text: {
					title: '',
					text: '',
				},
			});
			this.checkHaveUploadUprak();
			notify.show('Upload berhasil', "success");
		}).catch((error) => {
			notify.show('Upload berhasil', "success");
		});
	}

	loadStatusWebinnar = (uuid) => {
		let param = {
			uuid: uuid,		
		};
		$.post(API_WEBINAR_STATUS_COURSE_USER, param)
			.then(data => {
				console.log("DATA API_WEBINAR_STATUS_COURSE_USER >>> ", data);
				this.setState({
					status_webinar: data.payload,
				});
				console.log("Data SET_STATUS_WEBINNAR",this.state.status_webinar);
			})
			.fail(() => {
				console.log("Module progress not sent due to error");
			});
	}

	getAlertKey = () => {
		return "alert_seen_" + CheckAuth().email + "_" + this.state.uuid;
	};

	handleCloseAlert = () => {
		let alertKey = this.getAlertKey();
		store.set(alertKey, true);
		this.setState({ alert_seen: true });
	};

	doEnroll = e => {
		if (CheckAuth() === false) {
			this.setState({ enrolling: true });
			notify.show(
				`${trans.you} ${trans.must} ${trans.login} ${trans.first}`,
				"warning"
			);
			return;
		}

		$("#btn-modal-enroll").trigger("click");
		$(".loading").hide();
	};

	handleRedeem = e => {
		if (!this.checkLogin()) {
			return;
		}
		$("#btn-redeem").trigger("click");
		$(".loading").hide();
	};

	handleEnroll = e => {
		e.preventDefault();
		if (e.target.id === "prakerja") {
			this.props.history.push("/prakerja");
			return;
		}
		const { data } = this.state;
		const itemType = "course";

		console.log("PAYMENT STATUS >>> ", data.payment_status);

		if (
			(data.payment_status && data.payment_status === -4) ||
			(data.payment_status && data.payment_status === -5)
		) {
			notify.show(
				"Anda sudah memilih modul ini, lanjutkan transaksi anda terlebih dahulu",
				"warning"
			);
		} else {
			if (CheckAuth()) {
				this.props.history.push("/payment", { data, itemType });
			} else {
				this.props.history.push("/login");
			}
		}
	};

	finishEnroll = redirectUrl => {
		$(".modal-close").trigger("click");
		$(".loading").hide();
		this.props.history.push(redirectUrl);
	};

	// handleClick = (i, j, locked, e) => {
	handleClick = (i, j, locked,resource_type, title, data_topic, e) => {
		if (e) e.preventDefault();
		this.hitungPersentase()
		this.setState({ countDownTimerPause: 0 });
		let topic = null;

		var mainSub=i;
		var subModul=(j); //this recent index decreement 1/ check before index are there any false complete status

		let beforethisindex=(j); //this recent index decreement 1/ check before index are there any false complete status

		
		console.log("=============INDEXING SUB===================="+i);
		console.log("=============INDEXING SubModul===================="+j);

		var arr_sts=[];
		var all_main_sub=[];
		var submenuArr=[];
		for (let k = 0; k < i; k++) {
			// let cekResource_type=this.state.data.modules[i].topics[k].resource_type;
			let itemSub=this.state.data.modules[k];
			all_main_sub=[...all_main_sub,itemSub];
			var subArr=itemSub.topics;
			for (let indx = 0; indx < subArr.length; indx++) {
				let listitems=subArr[indx];
				submenuArr=[...submenuArr,listitems];
				
			}
			// all_main_sub = all_main_sub.concat(obj);

			// if(cekResource_type==1){
			// 	var cekModulCompleteBeforeStatus=this.state.data.modules[i].topics[k].completed;
			// } else{
			// 	var cekModulCompleteBeforeStatus=true;
			// }
			// arr_sts=[...arr_sts,cekModulCompleteBeforeStatus];
		}
		var cek = arr_sts.includes(false);
		let all_item_above=submenuArr.map((val)=>val)
		let filter_kuis_video = submenuArr.filter(   // search data videos/kuis its completed=false
			(vals) =>
			  vals.completed == false &&
			  (vals.resource_type == 1 || vals.resource_type == 4)
		  );

		// let all_item_above=submenuArr.map((val)=>val)
		this.setState({dataApi:all_main_sub,datasubarr:all_item_above,filterIsVideoKuis:filter_kuis_video})

		

		let Msg_info=(filter_kuis_video.length > 0)?'Anda harus menyelesaikan BAB sebelumnya terlebih dahulu'
				:`${trans.you} ${trans.must} ${trans.finish} ${trans.chapter} sebelumnya ${trans.first}`;

		//not first topic in module
		if(j > 0 && data_topic.locked == false) {
			Msg_info = 'Anda harus menyelesaikan TOPIK sebelumnya terlebih dahulu'
		}

		if (title == 'UJIAN PRAKTEK') {
			Msg_info = 'Anda harus menyelesaikan Post Test terlebih dahulu';
		}
		
				if (locked || filter_kuis_video.length >0) {
					var message = this.state.data.enrolled ? (
						// <span>{`${trans.you} ${trans.must} ${trans.finish} ${trans.chapter} sebelumnya ${trans.first}`}</span>
						<span>{`${Msg_info}`}</span>
					) : (
							<span>{`${trans.you} ${trans.must} ${trans.register} ${trans.first}`}</span>
						);
					notify.show(message, "warning");
				} else {
			module = this.state.data.modules[i];

			if (module) {
				topic = module.topics[j];
				topic.module_title = module.title;
				topic.selected = true;
				this.setState({ topic: topic });
				$(".hls-player").attr("autoplay", "autoplay");
			} else {
				notify.show(i + " : " + j + " :" + locked);
				//notify.show('Terjadi kesalahan, silakan coba lagi', "error");
			}
		}

		if (
			this.state.width < 800 ||
			(topic && topic.resource_type == CourseDetail.TYPE_QUIZ)
		) {
			super.scrollToTop(50);
		}
	};

	handlePinChange = e => {
		var errorMessage = "";
		var pinPattern = /^\d{6}$/;

		if (!pinPattern.test(e.target.value)) {
			errorMessage = alert.invalid_pin_digit;
		}

		this.setState({ errorMessage: errorMessage });
	};

	handleTypePin = event => {
		var charCode = parseInt(event.charCode);
		if (charCode != 13 && (charCode < 48 || charCode > 57)) {
			event.preventDefault();
		}
	};

	getResourceIcon = topic => {
		var icon = "";
		let { completed, selected, resource_type } = topic;

		if (selected) {
			return <img src={play} id="custom-resource-icon" />;
		} else if (completed) {
			return <img src={check} id="custom-resource-icon" />;
		} else if (resource_type === CourseDetail.TYPE_VIDEO) {
			return (
				<Icon className="left" small>
					video_library
				</Icon>
			);
		} else if (resource_type === CourseDetail.TYPE_AUDIO) {
			return (
				<Icon className="left" small>
					headset
				</Icon>
			);
		} else if (resource_type === CourseDetail.TYPE_PDF) {
			return (
				<Icon className="left" small>
					picture_as_pdf
				</Icon>
			);
		} else if (resource_type === CourseDetail.TYPE_QUIZ) {
			return (
				<Icon className="left" small>
					list
				</Icon>
			);
		}

		return (
			<Icon className="left" small>
				{icon}
			</Icon>
		);
	};

	nextChapter = (isNext) => {
		this.setState({ videoCompleted: true })

		let activeModule = this.state.data.modules[this.state.dataApi.length];
		let activeTopic = this.state.topic;
		let nextIndex = 0;

		activeModule.topics.find((topic, index) => { 
			if (topic.uuid == activeTopic.uuid) {
				nextIndex = index + 1;
			}
		});

		let nextTopic = activeModule.topics[nextIndex];
		let lastTopic = activeModule.topics[activeModule.topics.length - 1];

		if(nextTopic.resource_type == 1) {
			this.setState({ nextChapter: true });

			if(activeTopic.uuid != lastTopic.uuid && isNext) {
				this.setState({ nextChapter: false, videoCompleted: !this.state.videoCompleted })
				this.handleClick(this.state.dataApi.length, nextIndex, this.checkUprakLocked(nextTopic, nextIndex), nextTopic.resource_type, nextTopic.title, nextTopic)
			}
		}
	}

	onMediaAction = (event, topic, action) => {
		console.log(event)
		this.setState({eventState:event,isPlaying:action,countView:2,timeRunning:0, videoCompleted: false},() => this.hitungPersentase())
		let { uuid } = this.state;
		let url_link = API_COURSE_BASE_URL + uuid + "/progress";
		let param = {
			topic_uuid: topic.uuid,
			action: action
		};
		
		this.setTopicStatus(topic, action);
		$.post(url_link, param)
			.then(data => {
				console.log(data);
			})
			.fail(() => {
				console.log("Module progress not sent due to error");
			});

					//MODALS interval run if video playing
				if(this.state.isPlaying==1){
					  //set interval pause video and show modals in count 2.update and decrement every 900000 ms (15 minutes),if countDownTimerPause 1 is stop video
					  this.setState({ countDownTimerPause: 3 },
						// ()=>this.countDownIntervalStart()
						);
					} else{
						this.setState({ countDownTimerPause: 0 });
					}
				// calculate progress percent
				if(action==3){
					this.hitungPersentase()
					this.nextChapter()
				}

				super.scrollToTop(50);
	};

	_onReadyVideo(event) {
		event.target.playVideo();
		this.hitungPersentase()
	}

	setTopicStatus = (topic, action) => {
		if (action === CourseDetail.COURSE_ENDED) {
			topic.completed = true;
			this.setState({ topic: topic });
		} else if (
			action === CourseDetail.COURSE_PLAYED ||
			action === CourseDetail.COURSE_PAUSED
		) {
			topic.selected = true;
			this.setState({ topic: topic });
		}
	};
	onStateChangeVideo=(evntState)=>{
		this.setState({eventState:evntState,countView:1,timeRunning:0})
		if(evntState.data==1){
		  this.setState({timeRunning:0})
		}
		// this.handleModalOpenCLose(event);
	}
	handleOpenModalVideo = () => {
		this.setState({isOpenModalVideo:false,countDownTimerPause:0})
		let eventState=this.state.eventState;
		// console.log('cistate fullscreen', eventState);
		if(this.state.isFullScreen === false){
			if(this.state.isOpenModalVideo==false && eventState !==null){
				this.setState({isOpenModalVideo:true})
				eventState.target.pauseVideo()
				$("#btn-modal-youtube").trigger("click");
				$(".loading").hide();

			}
		}
		
	};
	
	handleCloseModalVideo = () => {
		let eventState=this.state.eventState;
		console.log('eventstate',eventState.target)
		// let status=event
		eventState.target.playVideo();
		this.setState({isOpenModalVideo:false})
	};
	_onReadyVideo(event) {
	  event.target.playVideo();
	}



	// countDownIntervalStart() {
	// 	//set interval pause video and show modals in count 2.update and decrement every 900000 ms (15 minutes),if countDownTimerPause 1 is stop video
	// 	if (this.state.countDownTimerPause > 0 && this.state.countDownTimerPause != 1) {
	// 	  this.timer = setInterval(this.countDownStart, 900000);
	// 	}
	//   }
	  
	countDownStart = () => {
		// Remove one second, set state so a re-render happens.
		let countdowdtimer = this.state.countDownTimerPause - 1;
		this.setState({
		  countDownTimerPause: countdowdtimer
		});
	
		// Check if we're at zero.
		if (countdowdtimer == 0) {
		  clearInterval(this.timer);
			window.scrollTo(0, 0)
		} else if(countdowdtimer==1){
			clearInterval(this.timer);
			window.scrollTo(0, 0)
			this.handleOpenModalVideo()
		}
	};

	playatMinutes = () =>{
		let eventState=this.state.eventState;
		let currentTime=this.state.eventState.target.playerInfo.currentTime;
		let playAt=this.state.eventState.target;
		eventState.target.seekTo(80);
		// seekTo
	}
	showCompleteModel = () =>{
		$("#graduate-btn").trigger("click");
		
	}
	PlayPauseVideo(){
		if(this.state.videoCompleted) {
			this.setState({ videoCompleted: false })
		}
		let eventState=this.state.eventState;
		let isPlaying=this.state.isPlaying;
		if(isPlaying==1){
			eventState.target.pauseVideo();
			this.setState({countDownTimerPause: 0});
			super.scrollToTop(50);

		}else{
			eventState.target.playVideo();
			this.setState({ countDownTimerPause: 3 },
				// ()=>this.countDownIntervalStart()
				);
			super.scrollToTop(50);
		}
	}

	toggleFullScreen = () => {
			var el = document.getElementById("YTVideo")
			
			if (el.requestFullscreen) {
			  el.requestFullscreen();
			} else if (el.msRequestFullscreen) {
			  el.msRequestFullscreen();
			} else if (el.mozRequestFullScreen) {
			  el.mozRequestFullScreen();
			} else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			}
		};

	handleCloseAbsenModal = () => {
		this.setState({ absent_code: '' })
	}

	
	// count persentase progress course
	hitungPersentase = () => {
		let datas = this.state.data.modules;
				// looping every subs
				var arr_dt = [];
				var dt_sub = [];
		const filterDataStatus = datas.map((val, index) => {
		  return val.topics;
		});
	
		var uncompleted=0;
		for (var i = 0; i < filterDataStatus.length; i++) {
		  let cekdata = filterDataStatus[i];
		  let filter_kuis_video = cekdata.filter(   // search data videos/kuis its completed=false
			(vals) =>
			  vals.completed == false &&
			  (vals.resource_type == 1 || vals.resource_type == 4 )
		  );

		  if (filter_kuis_video.length > 0) {
			uncompleted++; // if isset video/kuis false in every modules then increment uncompleted videos
			// let obj = filter_kuis_video;
			// arr_dt = arr_dt.concat(obj);
		  } 

		}

		let alldata = datas.length;
		let completed = parseInt(alldata) - parseInt(uncompleted);
		let percent_completed = (parseFloat(completed) / parseFloat(alldata)) * 100;
		// var roundedPercent = percent_completed.toFixed(0);
		var roundedPercent = percent_completed < 0 ? 0 : percent_completed.toFixed(0);

		// console.log(JSON.stringify(arr_dt));
		// console.log("JUMLAH ALL DATA : " + alldata);
		// console.log("JUMLAH UNCLOPMTED data : " + uncompleted);
		// console.log("JUMLAH COMPLETED data : " + completed);
		// console.log("Persent Complete : " + roundedPercent);
		var warna = "";
		switch (true) {
		  case roundedPercent <= 25:
			warna = "linear-gradient(71deg, #f6440b, #ff9800)";
			break;
		  case roundedPercent > 25 && roundedPercent <= 45:
			warna = "linear-gradient(71deg, #8bc34a, #cddc39)";
			break;
		  case roundedPercent > 45 && roundedPercent <= 75:
			warna = "linear-gradient(71deg, #84be40, #81db18)";
			break;
		  case roundedPercent > 75 && roundedPercent <= 99:
			warna = "linear-gradient(71deg, #2196f3, #cddc39)";
			break;
		  case roundedPercent >= 100:
			warna = "linear-gradient(71deg, #4caf50, #4caf50,#4caf50)";
			break;
		  default:
			warna = "f7980a";
		}
		this.setState({
		  progressCourse: {
			completed: roundedPercent,
			bgcolor: warna,
			alldata: alldata,
			countComplete:completed,
			uncompleted: uncompleted,
		  }
		});
	};

	getResourceObject = (topic, image) => {
		if (!topic || topic.locked) {
			return (
				<div className="center">
					<img src={image} />
				</div>
			);
		}

		var resourceType = topic.resource_type;
		var url = topic.resource_url;
		var secureUrl = topic.resource_secure_url;

		console.log("SELECTED COURSE TYPE >>> ", url);
		
		if (resourceType === CourseDetail.TYPE_VIDEO) {
			//return <ReactJWPlayer playerId='video' playerScript='https://content.jwplatform.com/libraries/PpDAvH51.js' file={url} image={image} />
			//return <ReactHLS style={{backgroundImage: `url(${image})`}} preload="none" id="video" poster={image} ref="video" width="100%" url={url} controls={true} />

			console.log("TOPIC DATA >>> ", topic);
			console.log("RESOURCE URL >>> ", url);
			console.log("SECURE URL >>> ", secureUrl);

			if (
				url !== null &&
				(url.includes("youtube.com") || url.includes("youtu.be"))
			) {
				let videoID;
				url = url
					.replace(/(>|<)/gi, "")
					.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

				if (url[2] !== undefined) {
					videoID = url[2].split(/[^0-9a-z_\-]/i);
					videoID = videoID[0];
				} else {
					videoID = url;
				}

				console.log("YOUTUBE VIDEO ID >>> ", videoID);
				
				let playondevice;
				if(rdd.isMobile === true){
					playondevice = "yt-video-wrapper-mobile"
				}else{
					playondevice = "yt-video-wrapper"
				}
				return (
					<div className="non-clickable">
						<YouTube
							videoId={videoID}
							id="YTVideo"
							containerClassName= {playondevice}
							opts={{
								height: "390",
								width: "800",
								
								playerVars: {
									autoplay: 1,
									controls: 0,
									disablekb: 0,
									rel:0,
								}
							}}
							onReady={this._onReadyVideo}
							onPlay={(event) => this.onMediaAction(event,topic, 1)}
							onPause={(event) => this.onMediaAction(event,topic, 2)}
							onEnd={(event) => this.onMediaAction(event,topic, 3)}
							onError={() => this.onMediaAction(topic, 4)}
							onStateChange={(evntState) => this.onStateChangeVideo(evntState)}
						/>
					</div>
				);
			} else {
				return (
					<VideoPlayer
						controls={true}
						src={url}
						hideControls={['playbackrates']}
						hidePlaybackRates = {true}
						onPlay={() => this.onMediaAction(this.state.topic, 1)}
						onPause={() => this.onMediaAction(this.state.topic, 2)}
						onEnd={() => this.onMediaAction(this.state.topic, 3)}
					 />
				);
			}
		} else if (resourceType === CourseDetail.TYPE_AUDIO) {
			return (
				<ReactPlayer
					style={{ background: `url(${image})` }}
					preload="none"
					id="audio"
					poster={image}
					ref="audio"
					width="100%"
					url={url}
					controls={true}
					onEnded={() => this.onMediaAction(this.state.topic, 3)}
					onError={() => this.onMediaAction(this.state.topic, 4)}
					onPause={() => this.onMediaAction(this.state.topic, 2)}
					onPlay={() => this.onMediaAction(this.state.topic, 1)}
				/>
			);
		} else if (resourceType === CourseDetail.TYPE_PDF) {
			return (
				<iframe src={`/js/ViewerJS/index.html#${url}`} className="pdf" frameBorder="0" allowfullscreen onReady={() => this.hitungPersentase()} onChange={() => this.hitungPersentase()} onClick={() => this.hitungPersentase()}></iframe>
			);
		} else if (resourceType === CourseDetail.TYPE_QUIZ) {
			var quizText =
				"Anda akan memulai kuis ini sebagai syarat untuk melanjutkan ke " +
				trans.chapter +
				" selanjutnya. Uji pemahaman Anda secara jujur dan selamat mengerjakan!";
			
			if (topic.title.toLowerCase() == "ujian akhir/post test") {
				quizText = (
					<div>
						Anda akan memulai post test/ujian ini sebagai syarat untuk mendapatkan SERITIFIKAT PENYELESAIAN kelas dan SERTIFIKAT KELULUSAN kelas.<br />Silahkan uji Pemahaman Anda secara jujur dan selamat mengerjakan!
					</div>
				);
			}
			
			var quizData = store.get(`quiz_${topic.uuid}`);
			var lastAttempt = topic.last_accessed;
			var retakeQuizBtn = "";
			var quizResultBtn = (
				<Link
					to={`/quiz/result/${topic.uuid}`}
					className="btn full-s capitalize"
					onChange={() => this.hitungPersentase()}
					onClick={() => this.hitungPersentase()}
				>
					Lihat Hasil
				</Link>
			);

			var completed = topic.completed;

			if (quizData) {
				quizText =
					"Kuis Anda sebelumnya belum disubmit. Silakan klik button di bawah untuk melanjutkan sesi kuis sebelumnya";

				retakeQuizBtn = (
					<Link to={`/quiz/${topic.uuid}`} className="btn full-s capitalize">
						Lanjut Kuis
					</Link>
				);
				quizResultBtn = "";
			} else if (lastAttempt) {
				// @fixme it should be lastAttempt

				retakeQuizBtn = (
					<Link
						to={`/quiz/${topic.uuid}`}
						className="btn full-s capitalize btn-outline"
					>
						Ulang Kuis
					</Link>
				);
				quizText =
					"Anda telah menyelesaikan kuis ini pada tanggal " +
					FormatDateIndo(lastAttempt) +
					". Anda bisa melihat hasil kuis Anda sebelumnya dengan menekan tombol di bawah.";
				if (completed) {
					let lastModule = this.state.data.modules[
						this.state.data.modules.length - 1
					];
					let lastTopic = lastModule.topics[lastModule.topics.length - 1];

					if (topic.uuid != lastTopic.uuid || this.state.data.completed) {
						retakeQuizBtn = "";
					}
				} else {
					quizText +=
						" Jika Anda belum lulus, Anda dapat mengulangi kuis ini sampai Anda lulus";
				}
			} else {
				retakeQuizBtn = (
					<Link to={`/quiz/${topic.uuid}`} className="btn full-s capitalize">
						Mulai Kuis
					</Link>
				);
				quizResultBtn = "";
			}

			var messagePesanHold = "";

			let webinar_quiz = this.state.kuis_webinar.find(kuis => kuis.uuid == topic.uuid);

			if(typeof webinar_quiz != 'undefined') {
				webinar_quiz = Object.keys(webinar_quiz).length > 0 ? true : false;
				if(webinar_quiz == true){ //=== kuis webinar
					if(this.state.status_webinar==false){ //=== absen webinar
						retakeQuizBtn = (
							<Modal
								trigger={
									<button className="btn bg-primary">Absen Kehadiran Webinar</button>
								}
							>
								<div className="center">
									<div>
										<h5>Masukkan Kode Absensi yang Kamu Dapatkan pada Saat Webinar</h5>
									</div>
									<div className="modal-content">
										<div className="input-field text-left">
											<input
												name="absent-code"
												type="text"
												placeholder="Kode Absensi"
												onChange={this.handleAbsentCodeChange}
												value={this.state.absent_code}
												autoComplete="off"
											/>
											<div className="helper-text text-left font-orange-red inline-block font-tiny">
												{this.state.errorAbsentCode}
											</div>
										</div>
									</div>
									<div className="d-flex-jc-center">
										<button className="btn btn-small delete-btn mr-xs" disabled={this.state.absent_loading ? true : false} onClick={() => this.submitAbsentCode()}>Submit</button>
										<button id="kode-absensi-modal-close" onClick={this.handleCloseAbsenModal} className="btn btn-small delete-btn bg-danger modal-close" disabled={this.state.absent_loading ? true : false}>Batal</button>
									</div>
								</div>
							</Modal>
						);
						quizResultBtn = "";
						messagePesanHold = (<div>Anda dapat mengerjakan Kuis Webinar setelah menekan tombol "Absen Kehadiran Webinar". Absen Kehadiran Webinar dibuktikan dengan cara memasukkan Kode/Pin Absen yang dibagikan di akhir sesi Webinar.</div>);
						quizText = "";
					}
				}
			}
			
			return (
				<div className="pad-m pad-l center">
					<h4>{topic.title}</h4>
					{/* <h5>{topic.module_title}</h5> */}
					<div className="pad-l">
						<img src={BASE_URL + "/img/quiz-reminder.png"} />
					</div>
					<p className="h5 font-light mb-m">{quizText}</p>
					<p className="h5 font-light mb-m" style={{color: "red"}}>{messagePesanHold}</p>
					{retakeQuizBtn} &nbsp; {quizResultBtn}
				</div>
			);
		}
	};

	getFloatingCourseBar = data => {
		var isMobile = this.state.width && this.state.width < 800;
		let hasCashback =
			CheckAuth().account_type == UserConstants.PAYTREN_ACCOUNT &&
			data.user_cashback > 0;
		let isEnrolled =
			data.enrolled &&
			(CheckAuth().account_type != UserConstants.PAYTREN_ACCOUNT ||
				data.price == 0);
		const paddedStyle = {
			paddingTop: "0.5rem",
			paddingBottom: "1rem",
			marginBottom: "-1rem"
		};
		const marginTop = { marginTop: "3rem" };
		const is_businessman = CheckAuth().is_businessman === 1;

		if (data.enrolled && !data.completed) {
			return "";
		}

		// DUMP DATA
		console.log("FLOATING COURSE BAR DATA >>> ", data);

		return (
			<div>
				<div
					className="bg-white pad-m row mb-0 border-bottom shadowed"
					id="floating-course-bar"
				>
					<div className="h4 font-narrow inner-course-bar">
						<div className="mb-0" id="price-section">
							{/* <Col l={12} m={12} s={12} className="enroll-section"> */}
								{!data.enrolled && (
									<div>
										<div className="text-right">
											<Row className="align-items-center digital-platform-wrapper">
												<div>
													{/* desktop */}
													<div className="text-left d-flex digital-platform desktop">
														<a href="https://m.bukalapak.com/kartu-prakerja/pencarian?from=omnisearch&from_keyword_history=false&search_source=omnisearch_keyword&source=navbar&keyword=geti%20incubator" target="_blank">
															<img src={ require("../../assets/digital-platform-icon/buka-lapak.png") } className="digital-platform-icon" />
														</a>
														<a href="https://www.tokopedia.com/kartu-prakerja/partner/geti-incubator" target="_blank">
															<img src={ require("../../assets/digital-platform-icon/tokopedia.png") } className="digital-platform-icon" />
														</a>
														<a href="https://pijarmahir.id/institution-partner/776216?page=1&limit=30" target="_blank">
															<img src={ require("../../assets/digital-platform-icon/pijar.png") } className="digital-platform-icon" />
														</a>
														<a href="https://pintaria.com/kartuprakerja/cari/hasil?keyword=GETI" target="_blank">
															<img src={ require("../../assets/digital-platform-icon/pintaria.png") } className="digital-platform-icon" />
														</a>
														<a href="https://prakerja.karier.mu/mitra/geti-incubator" target="_blank">
															<img src={ require("../../assets/digital-platform-icon/karier.mu.png") } className="digital-platform-icon" />
														</a>
													</div>
													{/* tablet */}
													<div className="text-left d-flex digital-platform tablet">
														<div>
															<a href="https://m.bukalapak.com/kartu-prakerja/pencarian?from=omnisearch&from_keyword_history=false&search_source=omnisearch_keyword&source=navbar&keyword=geti%20incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/buka-lapak.png") } className="digital-platform-icon" />
															</a>
															<a href="https://www.tokopedia.com/kartu-prakerja/partner/geti-incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/tokopedia.png") } className="digital-platform-icon" />
															</a>
														</div>
														<div>
															<a href="https://pijarmahir.id/institution-partner/776216?page=1&limit=30" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/pijar.png") } className="digital-platform-icon" />
															</a>
														</div>
														<div>
															<a href="https://pintaria.com/kartuprakerja/cari/hasil?keyword=GETI" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/pintaria.png") } className="digital-platform-icon" />
															</a>
															<a href="https://prakerja.karier.mu/mitra/geti-incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/karier.mu.png") } className="digital-platform-icon" />
															</a>
														</div>
													</div>
													{/* mobile */}
													<div className="text-left d-block digital-platform mobile">
														<div className="d-flex">
															<a href="https://m.bukalapak.com/kartu-prakerja/pencarian?from=omnisearch&from_keyword_history=false&search_source=omnisearch_keyword&source=navbar&keyword=geti%20incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/buka-lapak.png") } className="digital-platform-icon" />
															</a>
															<a href="https://www.tokopedia.com/kartu-prakerja/partner/geti-incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/tokopedia.png") } className="digital-platform-icon" />
															</a>
														</div>
														<div className="d-flex">
															<a href="https://pijarmahir.id/institution-partner/776216?page=1&limit=30" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/pijar.png") } className="digital-platform-icon" />
															</a>
															<a href="https://pintaria.com/kartuprakerja/cari/hasil?keyword=GETI" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/pintaria.png") } className="digital-platform-icon" />
															</a>
															<a href="https://prakerja.karier.mu/mitra/geti-incubator" target="_blank">
																<img src={ require("../../assets/digital-platform-icon/karier.mu.png") } className="digital-platform-icon" />
															</a>
														</div>
													</div>
												</div>
												<div className="d-flex price-wrapper">
													<div>
														<div
														className="price-section font-heavy font-orange"
														style={{ marginTop: "-0.2rem", verticalAlign:'bottom', display: 'inline-block' }}
														>
														<div>
															<div id="non-partner-floating-price" style={{textAlign:'left'}}>
																<h6 className="price-type" id="floating-price-type">
																	Harga
																</h6>
																<span className="floating-course-price">
																	{data.price > 0 && (
																		<span>{FormatPrice(data.price)}</span>
																	)}
																	{data.price === 0 && <span>GRATIS</span>}
																</span>
															</div>
														</div>
														</div>
													</div>
													<div className="buy-btn desktop">
														<BuyCourseButton
														onEnroll={this.handleEnroll}
														data={data}
														onRedeem={this.handleRedeem}
														onPayment={this.handlePayment}
														errorMessage={this.state.errorMessage}
														requiredCourse={data.required_course}
														/>
													</div>
												</div>
											</Row>
											<Row>
												<div className="buy-btn mobile text-center mt-s">
													<BuyCourseButton
													onEnroll={this.handleEnroll}
													data={data}
													onRedeem={this.handleRedeem}
													onPayment={this.handlePayment}
													errorMessage={this.state.errorMessage}
													requiredCourse={data.required_course}
													/>
												</div>
											</Row>
										</div>
									</div>
								)}
								{data.enrolled && data.completed && (
									<Row>
										<Col
											l={12}
											m={12}
											s={12}
											className="valign-wrapper right"
											id="floating-buttons"
										>
											{!data.has_reviewed && (
												<div>
													<a
														className="btn"
														// href="#course_rating_modal"
														id="give-rating-button"
														onClick={() =>
															$("#course_rating_button").trigger("click")
														}
													>
														<span className="hide-on-small-only">Tulis</span>{" "}
														Review
													</a>
												</div>
											)}
											{data.has_reviewed && data.user_rating && (
												<div id="user-course-rating-div">
													<span
														id="user-course-rating-head"
														className="font-medium"
													>
														Rating Darimu
													</span>
													<br />
													<StarRatings
														rating={data.user_rating}
														starDimension={"1.25rem"}
														starRatedColor={"#f2c94c"}
														starSpacing={"1px"}
													/>
												</div>
											)}
											<div data-tip={data.has_reviewed ? 'Lihat nilai dan sertifikat' : 'Silakan tulis review terlebih dahulu'}>
												<Link
													to={data.has_reviewed ? `/course/${data.slug}/recap` : '#'}
													className={"btn modal-close"}
													disabled={!data.has_reviewed}
													id="floating-recap-button"
												>
													Rekap Nilai
													</Link>
												<ReactTooltip place="top" type="info" effect="solid" />
											</div>
										</Col>
									</Row>
								)}
							{/* </Col> */}
						</div>
					</div>
				</div>
			</div>
		);
	};

	getRedeemCouponModal = () => {
		return (
			<form
				autocomplete="off"
				onSubmit={this.handleEnroll}
				className="mb-0 row"
			>
				<img className="mb-s" src={BASE_URL + "/img/logo-paytren-black.png"} />
				<h5>Beli Menggunakan Kupon</h5>

				<div className="mb-s">
					Dengan menekan tombol “Redeem”, Anda akan langsung terdaftar pada{" "}
					{trans.course} ini.
				</div>

				<Input id="coupon_code" label="Masukkan Kode Kupon" s={12} required />

				<Col s={12} className="error-msg font-red strong mnt-s">
					{this.state.errorMessage}
				</Col>

				<Input
					onChange={this.handlePinChange}
					onKeyPress={this.handleTypePin}
					id="pin"
					maxLength="6"
					type="password"
					pattern="[0-9]{6}"
					s={12}
					value="000000"
					required
					disabled
					hidden
				/>

				<a
					className="link strong"
					data-tip={`Kupon berisi kode yang dapat ditukarkan dengan ${trans.course_item}. Satu kupon hanya dapat ditukar dengan 1 ${trans.course_item} dan tidak dapat digunakan kembali.`}
				>
					Apa itu kupon ?
				</a>
				<ReactTooltip place="right" />
				<br />
				<br />
				{/*super.getLoading("loading")*/}
				<Button id="enroll-btn" s={12} className="full" waves="light">
					REDEEM
				</Button>
			</form>
		);
	};

	ModuleComponent = (data,activeTopic) => {
		let index_completed = 0;
		console.log("cek data module", data)
		return (
			<Collapsible className="modules-collapsible">
				{data.modules.map((module, i) => (
					<CollapsibleItem
						key={i}
						header={module.title}
						icon="keyboard_arrow_up" 
						expanded={i == 0}
					>
						<Collection>
							{module.topics.map((topic, j) => {
								console.log("cek topic", topic)
								topic.completed = (topic.resource_length=="WEBINAR" && this.state.status_webinar==true)? true : topic.completed;
								topic.resource_length = (topic.resource_length=="WEBINAR" && this.state.status_webinar==true)? '' : topic.resource_length;
								// 
								if(topic.completed ){ //index complated terakhir 
									index_completed = j+1;
									console.log("TESTING 1 ",topic.title,topic.completed,j,index_completed);
								}

								

								// || topic.resource_type == CourseDetail.TYPE_PDF

								if(j==0 && topic.completed==false ){
									index_completed = 0;
									console.log("TESTING 2 ",topic.title,topic.completed,j,index_completed);
								}

								if(j==index_completed && topic.resource_type == CourseDetail.TYPE_PDF){
									index_completed = j+1;
									console.log("TESTING 3 ",topic.title,topic.completed,j,index_completed);
								}
								

								return <CollectionItem
									className={activeTopic.uuid === topic.uuid ? "active" : ""}
									data-modulekey={i}
									data-topickey={j}
									data-locked={this.checkUprakLocked(topic,j,index_completed)}
									onClick={this.handleClick.bind(this, i, j, this.checkUprakLocked(topic,j,index_completed), topic.resource_type, topic.title, topic)}
									href={"#" + topic.uuid}
									key={j}
								>
									{this.getResourceIcon(topic)}
									<span
										className="font-light"
										style={
											topic.selected
												? { color: "#134b95" }
												: topic.completed
													? { color: "#F0BC5E" }
													: {}
										}
									>
										{topic.title}
									</span>
									<div className="valign-wrapper">
										<Icon tiny>{this.checkUprakLocked(topic,j,index_completed) && "lock"}</Icon>&nbsp;
										<span className="topic-length">
											{topic.resource_length || "00:00"}
										</span>
									</div>
								</CollectionItem>
							})}
						</Collection>
					</CollapsibleItem>
				))}
			</Collapsible>
		);
	} 

	render() {
		var data = this.state.data;
		var activeTopic = this.state.topic;
		var isMobile = this.state.width && this.state.width < 800;

		// DUMP DATA
		console.log("RENDER CHECK AUTH >>> ", CheckAuth());
		console.log("RENDER TOPIC DATA >>> ", activeTopic);
		console.log("RENDER TOPIC >>> ", activeTopic);

		let rating_specs = [
			{ topic: "rating", name: "rating", item: "modul" }
		];

		let nama = store.get('userdata') ? store.get('userdata').nama : 'Nama sesuai KTP';
		let comment_rating_specs = [
			{
				title: "Punya saran/ulasan untuk pelatihan ini?",
				description: "",
				placeholder: "Masukkan darimu menjadi bahan evaluasi kami",
				name: "user_comment"
			},
			{
				title: "Nama Lengkap",
				description: "Sesuai nama di KTP untuk ditampilkan di sertifikat",
				placeholder: nama,
				name: "user_name"
			}
		];

		if (this.state.session_expired || (CheckAuth() === false && this.state.enrolling)) {
			return <Redirect to={"/login?redirect=" + window.location.pathname} />;
		}

		if (!data) {
			return super.render();
		}

		let shareUrl = window.location.origin + `/course.php?uuid=${data.uuid}`;
		let shareContent = `${trans.course} ${data.title} oleh ${data.instructor}`;
		let hasCashback =
			CheckAuth().account_type == UserConstants.PAYTREN_ACCOUNT &&
			data.user_cashback > 0;
		let isEnrolled =
			data.enrolled &&
			(CheckAuth().account_type != UserConstants.PAYTREN_ACCOUNT ||
				data.price == 0);

		const { FacebookShareButton, TwitterShareButton } = ShareButtons;
		console.log("Data STATUS_WEBINNAR",this.state.status_webinar);

		// move ujian praktek to the bottom list
		let modules = data.modules[data.modules.length - 1];

		if(typeof modules != 'undefined' && modules.topics) {
			var last_topics = data.modules[data.modules.length - 1].topics;
			var up = 'UJIAN PRAKTEK';

			if(last_topics.find(topic => topic.title == up)) {
				let ujian_praktek = last_topics.find(topic => topic.title == up);

				if(last_topics[last_topics.length - 1].title != up) {
					last_topics = last_topics.filter(topic => !(topic.title == up));
				}
				
				if(typeof last_topics[last_topics.length - 1] != 'undefined') {
					if(last_topics[last_topics.length - 1].title != up) {
						last_topics[last_topics.length] = ujian_praktek;
					}
				}
		
				data.modules[data.modules.length - 1].topics = last_topics;
			}
		}
		// end move

		
		console.log("STATE DETAIL COURSE >>> ", this.state);
		let btnPausePlayColors=this.state.isPlaying==1?'#ff685d':'#34b9f6';
		return (
			<div>
				<RatingModal
					header="Beri Rating Kuliah Ini"
					rating_specs={rating_specs}
					comment_specs={comment_rating_specs}
					modal_name="course_rating"
					voucher_used={data.voucher_code_used}
					is_open={
						(store.get("review_modul") && store.get("review_modul") === this.state.uuid) || data.ask_to_review
					}
					callback={this.handleLoadData}
					api_url={API_COURSE_BASE_URL + this.state.data.uuid + "/review"}
				/>
				<div className="container narrow digital-platform-narrow" style={{minWidth: '80%'}}>
					<div className="bg-white pad-m row mb-0 border-bottom shadowed">
						<button onClick={()=>this.hitungPersentase()} id="btnTriggerProgressLoad" style={{display:'none'}}>run</button>
						<h5 id="top-course-title">{data.title}</h5>
						{/* <h6>{data.instructor}</h6> */}
						{
							this.state.link_materi ? 
								<a onClick={() => this.handleLinkMateri()}>
									<Button style={{ marginBottom: "10px" }} className="btn-pa">Lihat Materi Kelas</Button>
								</a>
							: 
								""
						}
						{/* <p><button onClick={()=>this.showCompleteModel()}>OKE</button></p> */}
						{/* <p><button onClick={()=>this.onFocus()}>OKE</button></p> */}
						{/* <p>{this.state.countDownTimerPause}</p> */}

						{
								this.state.data.enrolled?
								<span>
								<ProgressBar
									bgcolor={this.state.progressCourse.bgcolor}
									completed={this.state.progressCourse.completed}
								/>
								</span>:''
						}

						{
							this.state.topic.resource_type==1 && this.state.eventState !=null ?
							<div style={{float:'right',marginBottom:'-18px',marginTop:'6px'}}>
								<button id="btnFullScreen"  style={{marginRight: '10px',background:'green'}} onClick={()=> this.toggleFullScreen()}>
									<span>Fullscreen</span>
									<span className="material-icons icon-image-preview">fullscreen</span>
								</button>
								{ !this.state.nextChapter ?
								(
									!this.state.videoCompleted ? 
									(

										<button id="btnplaypause"  style={{background:`${btnPausePlayColors}`}} onClick={()=>this.PlayPauseVideo()}>
											
											{this.state.isPlaying==1?<span>pause</span>:<span>play</span>}
											{this.state.isPlaying==1?<span className="material-icons icon-image-preview">pause</span>:<span className="material-icons icon-image-preview">play_arrow</span>} 
										</button>
									) :
									(
										<button id="btnplaypause"  style={{background:`${btnPausePlayColors}`}} onClick={()=>this.PlayPauseVideo()}>
											<span>replay</span>
											<span className="material-icons icon-image-preview">play_arrow</span>
										</button>
									)
								)
								:
								(
									<button id="btnplaypause"  style={{background:`${btnPausePlayColors}`}} onClick={()=>this.nextChapter(true)}>
										<span>next</span>
										{this.state.isPlaying==1?<span className="material-icons icon-image-preview">pause</span>:<span className="material-icons icon-image-preview">play_arrow</span>} 
										</button>
								)
							}
							</div>
							:''
						}
					</div>
					{this.getFloatingCourseBar(data)}
					{data.locked && !this.state.alert_seen && (
						<div className="bg-orange font-white pad-m valign-wrapper">
							<div className="full">
								<span>
									Maaf, untuk melanjutkan {trans.course} ini Anda harus
									menyelesaikan{" "}
									<Link
										className="link strong"
										to={`/course/${data.required_course.uuid}`}
									>
										syarat {trans.course_item}{" "}
									</Link>{" "}
									terlebih dahulu
								</span>
							</div>
							<a onClick={this.handleCloseAlert} className="right">
								<Icon small>clear</Icon>
							</a>
						</div>
					)}
					<div className="row bg-white mb-0 shadowed" id="course-body">
						{isMobile || <div className="col s4 border-right">{ this.ModuleComponent(data,activeTopic)}</div>}
						<div
							className={
								isMobile
									? "col s12 border-left pb-m"
									: "col s8 border-left pb-m"
							}
						>
							{this.state.uprak.is_passed == null || this.state.topic.title != 'UJIAN PRAKTEK' ? (this.getResourceObject(activeTopic, data.thumbnail)) : null}

							{this.state.uploaded.length > 0 && this.state.topic.title == "UJIAN PRAKTEK" && this.state.uprak.is_passed == null && (
								<div>
									<h6 className="pl-s font-weight-bold">Kamu dapat mengupload <span className="text-warning">{this.state.uploaded.length || 0}/{this.state.uprak.max_uploadfile}</span> file</h6>
									<hr />
									<table className="file-list">
										<tr>
											<th>Nama File</th>
											<th>Status</th>
											<th></th>
										</tr>
										{(this.state.uploaded.map(item => {
											return (
												<tr>
													<td>
														<h6>{this.renderFileName(item.file_name)}</h6>
													</td>
													<td>
														{item.is_checked == true && item.is_passed == true && (
															<h6 className="text-success">
																File ini lulus pengecekan.
															</h6>
														)}

														{item.is_checked == true && item.is_passed == false && (
															<h6 className="text-danger">
																{item.failed_reason || ''}
															</h6>
														)}

														{item.is_checked == false  && (
															<h6 className="text-warning">
																File ini sedang dalam proses pengecekan.
															</h6>
														)}
													</td>
													<td>
													{item.is_passed == false || item.is_passed == null ? (
														<Modal
														trigger={
															<button className="btn btn-small delete-btn bg-danger">Hapus</button>
														}
													>
														<div className="center">
															<div>
																<h5>Apakah Anda yakin ingin menghapus file ini?</h5>
															</div>
															<div className="d-flex-jc-center">
																<button onClick={() => this.deleteFile(item.id)} className="btn btn-small delete-btn mr-xs modal-close">Ya</button>
																<button className="btn btn-small delete-btn bg-danger modal-close">Batal</button>
															</div>
														</div>
														</Modal>
													) : null}
													</td>
												</tr>
												
											)
										}))}
									</table>
								</div>
							)}

							{this.state.topic.title == "UJIAN PRAKTEK" && this.state.upload_uprak == false && this.state.uprak.max_file == false && this.state.uprak.is_passed == null &&
							this.state.rich_text_box == false && (
								this.renderUploadButton()
							)}

							{this.state.topic.title == "UJIAN PRAKTEK" && this.state.upload_uprak == true && (
								<div className="wrapper-form-uprak">
									<div>
										<div className="upload-uprak-loader"></div>
										<div className="pt-s mb-xss text-center">Sedang mengupload....
										</div>
									</div>
								</div>
							)}

							{this.state.topic.title == "UJIAN PRAKTEK" && this.state.upload_uprak == false && this.state.rich_text_box == true && (
								this.renderRichTextBox()
							)}


							{this.state.topic.title == "UJIAN PRAKTEK" && this.state.uprak.is_passed != null && (
								<div className="d-flex-jc-center mb-s">
									<div className="center">
										{ this.state.uprak.is_passed == true ?
											(
												// <h6 className="text-success text-center font-large">
												// 	Selamat! Kamu dinyatakan LULUS Pelatihan
												// </h6>
												<div>	
													<h6 className="text-success text-center">Selamat! Kamu dinyatakan Lulus Ujian Praktek</h6>
													<h6 className="text-center">Kamu berhasil menguji keterampilan kamu setelah mengikuti kelas ini.<br />Nilai Ujian Kamu</h6>
													<h6 className="text-success font-large">{parseInt(this.state.uprak.score)}</h6>
												</div>
											) :
											(
												<div>	
													<h6 className="text-danger text-center">Mohon maaf, Kamu belum berhasil</h6>
													<h6 className="text-center">Kamu bisa menjalankan ujian praktek kembali untuk membuktikan keterampilan kamu setelah mengikuti kelas ini. <br />Selamat mencoba!</h6>
												</div>
											)
										}
										
										{this.state.uprak.is_passed == false &&
										// (
										// 	<div className="mt-s">
										// 		<Link
										// 			to={`/course/${data.slug}/competence-certificate`}
										// 			className="btn capitalize btn-small"
										// 		>
										// 			Lihat Sertifikat
										// 		</Link>
										// 	</div>
										// ):
										(
											<div className="mt-s">
												<a className="btn capitalize btn-small" onClick={this.handleReset}>
													Ulang Ujian Praktek
												</a>
											</div>
										)}
									</div>
								</div>
							)}

							<Tabs className="tabs-fixed-width">
								<Tab title="" active> 
								{/* Kilasan */}
									{/*<div className="pad-m bg-grey border-all valign-wrapper">
							<Icon className="font-orange" small>stars</Icon><div className="padl-s"> Bonus <span className="font-orange">+{data.pac_point}PAC</span> jika menyelesaikan {trans.course} ini</div>
						</div>*/}
									<div className="pad-m">
										{data.enrolled && (
											<b className="font-grey">
												Anda sudah terdaftar dalam {trans.course_item} ini
												<br />
												<br />
											</b>
										)}

										<span id="course-title" className="font-medium">
											{data.title}
										</span>
										{/*<div>{data.modules.length} {trans.chapter}</div>
					  <br/>*/}
										<Row>
											{true && (
												<Col l={6} m={6} s={6}>
													<h6 className="price-type">Harga</h6>
													<span id="course-price" className="font-heavy">
														{data.price === 0
															? "GRATIS"
															: FormatPrice(data.price)}
													</span>
												</Col>
											)}
										</Row>

										<hr />
										{data.category && (
											<Link
												to={`/course/catalog?category_id=${data.category.id}`}
											>
												<span className="lp-detail-ctg mr-xs mt-s pad-xs-m">
													{data.category.name}
												</span>
											</Link>
										)}
										<hr />
										<div className="justify" id="course-desc">
											{ReactHtmlParser(data.description)}
										</div>
										<br />
										<hr />
										{data.instructor_avatar && (
											<Image
												src={data.instructor_avatar}
												className="left small circle mr-s"
											/>
										)}
										<b>{data.instructor}</b>
										<br />
										{data.instructor_detail}
										<hr className="mt-sxs" />

										{data.course_journey && <b>{trans.learning_path}</b>}
										<br />
										{data.course_journey && (
											<span>
												{trans.course} ini termasuk dalam kumpulan{" "}
												{trans.learning_path} berikut.
											</span>
										)}
										{data.course_journey && (
											<LearningPathItem data={data.course_journey} />
										)}
									</div>
								</Tab>

								{data.required_courses && (
									<Tab
										className={data.required_courses.length == 0 ? "hide" : ""}
										title="Syarat Modul"
									>
										<div className="pad-m">
											<div className="strong font-grey mb-m">
												Anda harus menyelesaikan Modul berikut terlebih dahulu
												secara berurutan
											</div>
											{data.required_courses.map((course, i) => (
												<div className="valign-wrapper border-bottom mb-s">
													<div className="mnt-s">
														{course.completed && (
															<div className="badge-check left lh-50">
																<Icon className="icon-course">
																	check_circle
																</Icon>
															</div>
														)}

														{!course.completed && (
															<div className="badge left center lh-50">
																{i + 1}
															</div>
														)}
													</div>
													<CourseItem
														hideInstructor="true"
														className="section-card"
														data={course}
													/>
												</div>
											))}

											{data.required_courses.length == 0 && (
												<div className="pad-xl center">
													<img src={BASE_URL + "/img/profile/ic-riwayat.png"} />
													<br />
													<br />
													<div className="strong font-grey">
														{trans.course} ini tidak memiliki syarat
													</div>
												</div>
											)}
										</div>
									</Tab>
								)}

								{/* TODO Bereskan Ini, tab ini ga muncul ketika desktop */}
								{/* <Tab
									title="Materi"
									style={{ display: !isMobile ? "none" : "inherit" }}
								>
									{isMobile && module}
								</Tab> */}

								<Tab className={!isMobile ? "hide" : ""} title="Materi">
									{isMobile && this.ModuleComponent(data,activeTopic)}
								</Tab>
							</Tabs>
						</div>

						<Col s={12} className="pad-m bg-grey">
							<div className="center-align">
								<span className="h5 font-grey mr-s">Bagikan ke</span>
								{/* <FacebookShareButton
									className="btn btn-circle mr-xs"
									url={shareUrl}
									title={shareContent}
								>
									<FontAwesome name="facebook" />
								</FacebookShareButton> */}
								<TwitterShareButton
									className="btn btn-circle mr-xs"
									url={shareUrl}
									title={shareContent}
								>
									<FontAwesome name="twitter" />
								</TwitterShareButton>
							</div>
						</Col>
					</div>
				</div>
				<Modal
					trigger={
						<Button id="graduate-btn" className="hide">
							SUBMIT
						</Button>
					}
				>
					<div className="center almost-full">
						<h4>Selamat Anda Telah Menyelesaikan {trans.course} Ini </h4>
						<img
							className="mt-s mb-m"
							src={BASE_URL + "/img/ic_medallion.png"}
						/>
						<div className="mb-m">
							Anda telah menyelesaikan seluruh {trans.chapter} dari{" "}
							{trans.course} ini. Kami memberikan Lembar Sertifikat sebagai bukti
							Anda telah lulus melewati pembelajaran.
						</div>
						<Link to={`/course/${data.slug}/recap`} className="btn modal-close">
							Rekap Nilai
						</Link>
						<h4 />
					</div>
				</Modal>
				<Modal trigger={<Button className="hide" id="btn-redeem" />}>
					{this.getRedeemCouponModal()}
				</Modal>
								{/* MODAL POP UP */}
				<Modal trigger={<Button className="hide" id="btn-modal-youtube" />}
					modalOptions={{ dismissible: false }}
					options={{
						endingTop: '10%',
						inDuration: 250,
						onCloseEnd: null,
						onCloseStart: null,
						onOpenEnd: null,
						onOpenStart: null,
						opacity: 0.5,
						outDuration: 250,
						preventScrolling: true,
						startingTop: '4%'
					}}
				>
					<div className="center almost-full">
							<h5> Klik ok untuk melanjutkan pelajaran ! </h5>
							<div className="mb-m">
									Apakah anda masih ingin melanjutkan sesi video ini?
							</div>
							<Button className="btn modal-close" onClick={this.handleCloseModalVideo}>
								OKE 
							</Button>
						</div>
				</Modal>
			</div>
		);
	}
}

export default CourseDetail;
