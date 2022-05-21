import React from 'react'
import { Link } from 'react-router-dom'
import Image from '../Image';
import {Col, Row, ProgressBar, Icon} from 'react-materialize'
import $ from 'jquery';

class QuizHeader extends React.Component {
	constructor(props) {
	    super(props);
	}

  	render() {

  		var data = this.props.data;
  		var slug = this.props.slug;
  		var url =`/course/${slug}`;

  		return (
  			<div>
	  			<div className="pad-ml bg-white h4 border-bottom shadowed quiz-header">
	  				<div className="container font-narrow">
	  					<Link to={url} className="font-orange">
	  						<Icon className="left" medium>keyboard_arrow_left</Icon>
	  					</Link>
		  				<span className="font-light font-black">{data.title}</span>
		  				<br/>
		  				{data.chapter_title &&
	                	<span className="font-small">Dari <Link to={url} className="font-orange">{data.chapter_title}</Link></span>
	                	}

	                	{data.instructor &&
	                	<span className="font-small font-black">Oleh {data.instructor}</span>
	                	}

		  			</div>
		  		</div>
		  		<br/>
		  		<Row className="loading mb-0" style={{display:'none'}}><Col s={12}><ProgressBar /></Col></Row>
	  		</div>
  		)
	}
}
export default QuizHeader
