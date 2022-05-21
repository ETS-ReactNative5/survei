import React from 'react'
import Page from '../../Page'
import Carousel from '../../Carousel'
import Section from '../../Section'
import {Row, Col} from 'react-materialize';
import store from 'store';
import {CheckAuth, API_HOME} from '../../Util'
import DocumentMeta from 'react-document-meta'
import $ from 'jquery';
import WOW from "wowjs";
import './Home.css';

class Home extends Page {
  constructor(props) {
    super(props);
    this.state = {banner: [], sections:[]};
  }

  componentDidMount() {
    this.handleLoadData();
    const wow = new WOW.WOW();
    wow.init();
  }

  handleLoadData = (e) => {
    let cachedData = store.get("home_data");

    if (cachedData) {
      this.setState(cachedData);
      return;
    }

    $.get(API_HOME, {journey : 1})
      .then((data) => {
        let homeData = { announcement : data.payload.announcement, banner: data.payload.banner, sections: data.payload.sections };
        store.set("home_data", homeData);

        console.log("HOME DATA >>> ", homeData);

        this.setState(homeData);

        if (CheckAuth() && data.payload.announcement) {
          let announcementKey = "announcement_seen_" + data.payload.announcement.uuid + "_" + CheckAuth().agenid;
          let isAnnouncementSeen = store.get(announcementKey);

          if (!isAnnouncementSeen) {
            $("#announcement-btn").trigger("click");
            store.set(announcementKey, true);
          }
        }
    });
  }

  handleSearchCourse = (e) => {
    e.preventDefault();

    let param = { query : $("#course_keyword").val() }
    this.props.history.push("/course/catalog?" + $.param(param));
  }

  handleSearchEvent = (e) => {
    e.preventDefault();

    let param = {
      query : $("#event_keyword").val(),
      time : $("#event_time").val(),
      province : $("#event_location").val(),
    }

    this.props.history.push("/event/catalog?" + $.param(param));
  }

  getSlider = () => {
    var isLogin = (CheckAuth() !== false);

    if (isLogin) {
      var slider = (
        <div>
          <div className="bg-maroon pb-l pt-m">
            <Carousel items={this.state.banner} />
          </div>
        </div>
      )
    } else if (!this.state.banner.length) {
      return super.getLoadingMedium();
    } else {
      slider = (
        <div className="video-banner">
          <Row className="container mb-0">
            <Col s={12} m={5} className="mb-m fadeInLeft wow">
              <h3 className="font-white">Pengajaran Bisnis Berbasis Digital</h3>
              <h5 className="font-white font-light">Era Industri 4.0 menuntut Anda untuk mampu menguasai dunia digital. Dalam pembelajaran online learning yang aplikatif untuk bisnis berbasis digital, GeTI hadir untuk membantu Anda. Dengan online learning, Anda bisa belajar lebih fleksibel tidak terikat oleh ruang dan waktu.</h5>
            </Col>
            <Col s={12} m={6} className="offset-m1 fadeIn wow">
              <iframe width="100%" height="300" src="https://www.youtube.com/embed/FTXCHJ8oGIY" frameBorder="0" allowFullScreen={true}></iframe>
            </Col>
          </Row>
        </div>
      )
    }

    return slider;
  }

  getSection = () => {
    if (!this.state.sections.length) { return super.getLoadingMedium() }

    console.log("HOME SECTIONS >>> ", this.state.sections);

    return this.state.sections.map((section, i) => (
      <Section key={i} order={i} data={section} />
    ))
  }

  componentWillUpdate(nextProps) {
    const { location, history } = nextProps;

    if (location.state && location.state.needRefresh) {
      history.replace('/', { needRefresh: false })

      store.remove('home_data')
      this.handleLoadData()
    }
  }

  render() {
    if (!this.state.banner.length) {
      return super.render()
    }
    let slider = this.getSlider();

    return (
      <div className="mb-xl">
        <DocumentMeta {...this.meta} />
        { slider }
      </div>
    )
  }
}
export default Home
