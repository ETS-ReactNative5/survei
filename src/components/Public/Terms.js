import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_COMMUNITY_BASE_URL , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon, Button, Modal } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import ReactDOM from 'react-dom'

class Terms extends Page {

  constructor(props) {
      super(props);
  }

  adjustHeight(e) {
    e.target.height = e.target.contentWindow.document.body.scrollHeight + "px";
  }

  render() {
    return (
      <div className="bg-white pb-m border-bottom">
        <div className="bg-banner ptb-l">
          <Row className="container valign-wrapper">
            <Col className="font-white" m={12}><h4 className="font-white font-light mb-0">Privacy Policy</h4></Col>
          </Row>
        </div>
        <div className="mt-m container" style={{height : this.state.iFrameHeight}}>
          <iframe onLoad={this.adjustHeight} ref="iframe" width="100%" height="100%" scrolling="no" src="/privacypolicy.htm" />
        </div>
      </div>
      )
  }
}

export default Terms
