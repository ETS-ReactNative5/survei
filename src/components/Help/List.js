import React from 'react'
import store from 'store'
import $ from 'jquery';
import { QueryParam, CheckAuth, API_TICKET_URL, API_HANDESK_TOKEN, FormatDateIndo , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Modal, Button, Collection, CollectionItem, Icon, Badge } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Page from '../Page';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import FontAwesome from 'react-fontawesome';

class HelpList extends Page {
	static STATUS_NEW     = 1;
    static STATUS_OPEN    = 2;
    static STATUS_PENDING = 3;
    static STATUS_SOLVED  = 4;
    static STATUS_CLOSED  = 5;
    static STATUS_MERGED  = 6;
    static STATUS_SPAM    = 7;

	constructor(props) {
	    super(props);

	    window.onpopstate = () => {
	    	this.toggleDetail();
	    }
	}

	componentDidMount = () => {
	  $(".btn-help").hide();
      this.handleLoadData();
  	}

  	handleLoadData() {
  		$.get(API_TICKET_URL, {requester : CheckAuth().email}).then((result) => {   
  			result.payload.comments = null;
	        this.setState({data : result.payload, activeIndex : 0});

	        if (result.payload.length == 0) {
	        	this.toggleDetail();
	        } else {
	        	this.handleLoadDetail();
	        }      
      	});
  	}

  	handleLoadDetail(activeIndex) {
  		let data = this.state.data;

  		if (!activeIndex && activeIndex !== 0) {
  			activeIndex = this.state.activeIndex
  		} else {
  			this.setState({activeIndex : activeIndex});
  		}

  		$.get(API_TICKET_URL + "/" + data[activeIndex].id).then((result) => {   
  			data[activeIndex].comments = result.payload.comments;
  			data[activeIndex].attachments = result.payload.attachments;
	        this.setState({data : data});

	        $("#comment-list").scrollTop($("#comment-list")[0].scrollHeight);
      	});
  	}

  	handleSubmitComment = (e) => {
  		e.preventDefault();

  		let data = this.state.data;
  		let formData = new FormData($("#form-comment")[0]);
  		let url = API_TICKET_URL + "/" + data[this.state.activeIndex].id + "/comments";

		$.ajax({
		    url: url,
		    data: formData,
		    type: 'POST',
		    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
		    processData: false, // NEEDED, DON'T OMIT THIS
		    // ... Other options like success and etc
		}).then((data) => {
			$("#comment-box").val('');
			this.handleLoadDetail();
			this.clearAttachment();
		});
  	}

  	toggleDetail = () => {
  		$("#right-col").toggleClass("hide-on-med-and-down");
  		$("#left-col").toggleClass("hide-on-med-and-down");
  		$("#add-btn").toggleClass("hide-on-med-and-down");

  		this.setState({detail : $("#left-col.hide-on-med-and-down").length});
  	}

  	clearAttachment=(e)=>{
  		$("#attachment").val(null);
  		this.setState({image : {}});
  	}

  	getStatusLabel(status) {
  		if (status == HelpList.STATUS_NEW) {
  			return <div className="right badge-status neutral ml-s">Baru</div>
  		} else if (status == HelpList.STATUS_OPEN || status == HelpList.STATUS_PENDING) {
  			return <div className="right badge-status ml-s">Diproses</div>
  		} else if (status == HelpList.STATUS_CLOSED || status == HelpList.STATUS_SOLVED) {{
  			return <div className="right badge-status success ml-s">Selesai</div>
  		}}
  	}

  	generateAttachment(attachment) {
  		if (attachment.path.match(/.(jpg|jpeg|png|gif)$/i)) {
  			return <img className="left mt-xs mr-s height-120" src={attachment.url} />
  		} else {
  			return <a className="valign-wrapper font-orange light mt-xs" target="_blank" href={attachment.url}>
  				<Icon>attachment</Icon> <span>&nbsp;{attachment.path}</span>
  			</a>
  		}
  	}

  	render() {
  		let data = this.state.data;
  		let userdata = CheckAuth();
  		let activeIndex = this.state.activeIndex;
  		let counter = this.props.counter

  		if (!data) {
  			return <div></div>;
  		}

	    return (
	    <div className="container narrow bg-white mb-m fullheight">	    	
		    <Row>
		    	<Col id="left-col" l={5} s={12}>
		    		<div className="border-right relative">
		    			<div id="add-btn" className="fixed-action-btn horizontal absolute">
				    		<Link to="/help/form" className="btn btn-small btn-rounded">
				    			<span>Kirim Pesan Baru</span><Icon className="right">message</Icon> 
				    		</Link>
				    	</div>

			    		<div className="font-grey pad-m border-bottom strong">List Pesan Bantuan Anda</div>
			    		{data.length == 0 &&
				    		<div className="font-grey strong valign-wrapper fullheight scrollable">
				    			<div className="center">Tidak Ada pesan yang dapat ditampilkan</div>
				    		</div>
			    		}

			    		{data.length > 0 &&
			    		<div className="fullheight scrollable pb-l">

			    		<Collection>
			    		{data.map((item, i) => 
			    			<CollectionItem onClick={()=>{this.handleLoadDetail(i)}} className={this.state.activeIndex == i ? "active" : ""} href={"#" + item.id}>
			    				{i < counter && <Badge className="red right absolute-right hide" newIcon>1</Badge>}

			    				{this.getStatusLabel(item.status)}
			    				<div className="strong mb-xs">{item.title}</div>
			    				<div className="font-grey mb-xs">{item.body}</div>
			    				<div className="right-align italic font-tiny font-grey mbn-s">{FormatDateIndo(item.updated_at, true)}</div>
			    			</CollectionItem>
			    		)}
			    		</Collection>
			    		</div>
			    		}

		    		</div>
		    	</Col>
		    	<Col id="right-col" className="hide-on-med-and-down" l={7} s={12}>
		    		{data.length == 0 &&
		    		<div className="strong valign-wrapper fullheight scrollable">
		    			<div className="center">
		    				<img src={BASE_URL + "/img/help/ic_cs.png"} />
		    				<h5>Selamat datang di Layanan Pengguna</h5>
		    				<div className="strong font-grey mb-s">Punya kendala dalam penggunaan aplikasi Skydu Indonesia?</div>
		    				<Link to="/help/form" className="btn capitalize">Hubungi Kami</Link>
		    			</div>
		    		</div>
		    		}	

		    		{data.length > 0 &&
		    		<div>
		    			<div className="valign-wrapper border-bottom">
		    			<a onClick={this.toggleDetail} className="pl-sm hide-on-large-only"><Icon>arrow_back</Icon></a>
				    		<div className="pad-m">
				    			<div className="font-grey">Pesan ID #{data[activeIndex].id}</div>
				    			<div className="strong h5">{data[activeIndex].title}</div>
				    		</div>
			    		</div>

			    		{this.state.image.attachment &&
			    		<div className="fullheight shorter scrollable black valign-wrapper relative">
			    			<div className="bg-grey pad-m absolute-top strong pb-s">
			    			<a onClick={this.clearAttachment} className="right"><Icon small>clear</Icon></a>
			    			<h5 className="mb-0">Preview</h5>
			    			</div>
			    			{this.state.image.attachment == -1 && <h5 className="center font-white mt-m">No Preview is available</h5>}
			    			{this.state.image.attachment != -1 && <img className="full" src={this.state.image.attachment}/>}
			    		</div>
			    		}

			    		{!this.state.image.attachment &&
			    		<div id="comment-list" className="fullheight scrollable shorter relative border-bottom">
				    		<div className="pad-m border-bottom">
					    		<div className="strong">{userdata.nama}</div>
					    		<div>{data[activeIndex].body}</div>
					    		<Row>

						    		{data[activeIndex].attachments && data[activeIndex].attachments.map((attachment) =>
						    		this.generateAttachment(attachment)
						    		)}
					    		</Row>
					    		<div className="mt-xs right-align italic font-tiny font-grey mbn-s">{FormatDateIndo(data[activeIndex].created_at, true)}</div>
				    		</div>
				    		{data[activeIndex].comments && data[activeIndex].comments.map((comment, i) => 
				    		<div className="relative">
				    		{i==data[activeIndex].comments.length-1 && comment.user_id && <Badge className="red right" newIcon></Badge>}
				    		<div className="pad-m border-bottom">
				    			

					    		<div className="strong">{comment.author.name}</div>
					    		<div>{comment.body}</div>
					    		<Row>
						    		{comment.attachments.map((attachment) =>
						    		this.generateAttachment(attachment)
						    		)}
					    		</Row>
					    		<div className="mt-xs right-align italic font-tiny font-grey mbn-s">{FormatDateIndo(comment.created_at, true)}</div>
				    		</div>
				    		</div>
			    			)}
			    		</div>
			    		}
			    		<form className="relative" id="form-comment" onSubmit={this.handleSubmitComment}>
			    			<Input id="comment-box" name="body" s={12} className="mb-0" type="text" placeholder="Tulis Balasan Anda" required />
			    			<input type="hidden" name="new_status" value={HelpList.STATUS_OPEN} />
			    			<label id="attachment-box" for="attachment">
			    				<Icon>add_a_photo</Icon>
			    				
 								<input onChange={this.handleImageChange} type="file" name="attachment" id="attachment" ref="attachment" className="inputfile" />
							</label>
			    			<button type="submit"><Icon>send</Icon></button>
			    		</form>
		    		</div>
		    		}
		    	</Col>
		    </Row>
	    </div>
	    )
	}
}
export default HelpList
