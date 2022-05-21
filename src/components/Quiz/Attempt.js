import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_PROFILE, API_QUIZ_BASE_URL, CheckAuth , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Pagination, Button, Icon, Modal } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import QuizHeader from './Header';

class QuizAttempt extends Page {
	constructor(props) {
	    super(props);
	    this.state = {data: null, uuid : props.match.params.uuid, answers : {}, submitted : false};
	}

	componentDidMount() {
		$(".btn-help").hide();
	    this.handleLoadData();
	}

	handleLoadData = (e) => {
		$.get(API_QUIZ_BASE_URL + this.state.uuid)
		  .then((data) => {
			if(typeof data.payload.need_webinar_absent != "undefined") {
				notify.show("Harap isi absensi webinar terlebih dahulu!", "warning")

				setTimeout(() => {
					this.props.history.goBack();
				}, 1500)
			} else {
				var quizData = this.getQuizSession();
	
				if (quizData) {
					this.setState(quizData);
				} else {
					this.setState({ data: data.payload, question : data.payload.questions[0], number : 1});
					this.saveQuizSession();
				}
			}
		});
	}

	handleConfirmSubmit = (e) => {
		e.preventDefault();
		$("#submit-btn").trigger("click");
	}

	handleSubmitQuiz = (e) => {
	    $.post(API_QUIZ_BASE_URL + this.state.uuid, {answers : JSON.stringify(this.state.answers) })
	      .then((data) => {
	      	var payload = data.payload;
	      	store.remove(`quiz_${this.state.uuid}`);
	      	store.set(`result_${this.state.uuid}`, payload);

	      	if(payload.is_last_chapter && payload.is_passed) {
	      		store.set(`completed_${payload.course_uuid}`, true);
				store.set('review_modul', payload.course_uuid);
	      	}

	      	this.setState({submitted : true});
	    })
			.catch(() => {
			});
	}

	handleSelectQuestion = (page) => {
	    this.setState({question : this.state.data.questions[page-1]});
	}

	handleNextQuestion = (e) => {
	   	if (this.state.question.order == this.state.data.questions.length - 1) {
	   		this.handleConfirmSubmit(e);
	   	} else {
	   		this.setState({question : this.state.data.questions[this.state.question.order + 1]});
	   		super.scrollToTop();
	   	}
	   	e.preventDefault();
	}

	handlePreviousQuestion = () => {
	    this.setState({question : this.state.data.questions[this.state.question.order-1]});
	    super.scrollToTop();
	}

	handleSelectAnswer = (e) => {
		var questionUuid = this.state.question.uuid;
		var answers = this.state.answers;
		answers[questionUuid] = e.target.value;
		this.setState({answers : answers});
		this.saveQuizSession();
	}

	saveQuizSession = () => {
		store.set(`quiz_${this.state.uuid}`, this.state);
	}

	getQuizSession = () => {
		return store.get(`quiz_${this.state.uuid}`);
	}

	renderQuestion = (question)  => {
		return question.split('\n').map(str => <div>{str}<br /></div>);
	}

  	render() {
  		var data = this.state.data;
  		var question = this.state.question;

  		if (!data) {
  			return super.render();
  		}

  		if (this.state.submitted) {
  			return <Redirect to={"/quiz/result/" + data.uuid} />
  		}


  		return (
  			<div className="bg-white fullheight">
  				<QuizHeader data={data} slug={data.course_slug} />
	  			<form onSubmit={this.handleNextQuestion.bind(this)} className="pad-ml">
		  			<div className="container mt-m mb-m">
		  				<h5 className="font-orange">Pertanyaan {question.order + 1} <span className="font-grey">dari {data.questions.length}</span></h5>
		  				<h5><p>{this.renderQuestion(question.content)}</p></h5>

		  				<div className="answers">
		  				{question.answers && question.answers.map((answer, i) =>
							<p className="">
								<Input required onClick={this.handleSelectAnswer} name='answer' type='radio' value={answer.uuid} label={answer.content} checked={this.state.answers[question.uuid] == answer.uuid} />
							</p>
				        )}
				        <div>&nbsp;</div>

				        </div>
				        <Pagination className="center hide" onSelect={this.handleSelectQuestion} items={data.questions.length} activePage={question.order+1} maxButtons={data.questions.length} />

				        <div className="footer-fixed bg-grey pad-ml">
				        	<div className="container">
					        {question.order > 0 &&
					        	<a onClick={this.handlePreviousQuestion.bind(this)} className="btn left btn-outline">SEBELUMNYA</a>
					        }
					        {question.order < data.questions.length-1 &&
					        	<Button className="right">LANJUT</Button>
					        }
					        {question.order == data.questions.length-1 &&
					        	<Button className="right">SUBMIT</Button>
							}
							</div>
						</div>
						<Modal trigger={
		                    	<Button id="submit-btn" className="right hide">SUBMIT</Button>
		                    }><h5>Submit Jawaban</h5>
		                    <p>Apakah Anda yakin ingin melakukan submit kuis?<br/>Periksa kembali jawaban Anda sebelum melakukan submit kuis</p>
		                    <div className="mt-m">
		                    	<a className="btn modal-close btn-outline">BATAL</a>
		                    	<a onClick={this.handleSubmitQuiz.bind(this)} className="btn modal-close right">SUBMIT</a>
		                    </div>
		                </Modal>
				        <br/><br/>
		  			</div>
		  		</form>
  			</div>
  		)
	}
}
export default QuizAttempt
