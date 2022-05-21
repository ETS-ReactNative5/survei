import React from 'react'
import Page from '../../Page'
import Carousel from '../../Carousel'
import Section from '../../Section'
import {Row, Col, Card, Icon, CardTitle} from 'react-materialize';
import store from 'store';
import {CheckAuth, BASE_URL, API_HOME, API_COURSE_BASE_URL, API_CATEGORY} from '../../Util'
import DocumentMeta from 'react-document-meta'
import $ from 'jquery';
import WOW from "wowjs";
import './Home.css';
import { element } from 'prop-types';
import { Link } from 'react-router-dom';

class Home extends Page {
  constructor(props) {
    super(props);
    this.state = {banner: [], sections:[], courses:[], categories:[]};
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
      this.setState(store.get("course_data"));
      this.setState(store.get("category_data"));
      return;
    }

    $.get(API_HOME, {journey : 1})
      .then((data) => {
        let homeData = { announcement : data.payload.announcement, banner: data.payload.banner, sections: data.payload.sections };
        store.set("home_data", homeData);

        // console.log("HOME DATA $get >>> ", homeData);

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

    $.get(API_COURSE_BASE_URL, {journey : 1})
      .then((data) => {
        let courseData = { courses: data.payload };
        store.set("course_data", courseData);

        // console.log("COURSE DATA >>> ", courseData);

        this.setState(courseData);

    });

    $.get(API_CATEGORY, {journey : 1})
      .then((data) => {
        let categoryData = { categories: data.payload };
        store.set("category_data", categoryData);

        console.log("CATEGORY DATA >>> ", categoryData);

        this.setState(categoryData);

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

  getCategory = () => {
    var category = (
          this.state.categories.map(item => (
            <Col
            l={3}
            m={3}
            s={12}
            >

            { item.id == 1 
              ? 
                <div className="cardImage">
                <Link to={'/prakerja'}><img src = { item.icon_url } className="catImage" />
                      <h5>{item.name}</h5></Link>
                </div>
              :
              <div className="cardImage">
              <Link to={`/course/catalog?category_id=${item.id}`}><img src = { item.icon_url } className="catImage" />
                <h5>{item.name}</h5></Link>                
              </div>
            }

            </Col>
        ))
        )

    return category;
  }

  getCategory2 = () => {
    var category

        category = (
          this.state.categories.map(item => (
            <Col
            l={3}
            m={3}
            s={12}
            >
              <Link to={`/course/catalog?category_id=${item.id}`}>
                <Card
                  closeIcon={<Icon>close</Icon>}
                  header={<CardTitle className="card-item2" image={item.icon_url}>
                  {item.name}
                  </CardTitle>}
                >
                </Card>
              </Link>
            </Col>
        ))
        )

    return category;
  }

  getCourse = () => {
    var course = (
      this.state.courses.map(item => (
          <Col
            l={3}
            m={3}
            s={12}
          >
          <Link to={`/course/${item.slug}`}>
              <Card
                closeIcon={<Icon>close</Icon>}
                header={<CardTitle image={item.thumbnail}></CardTitle>}
                revealIcon={<Icon>more_vert</Icon>}
              >
                { item.title }<br />
                <div style={{bottom: "0px"}}>Rp. { item.final_price }</div>
              </Card>
            </Link>
          </Col>
      ))
    )
    return course;
  }

  getCourse2 = () => {
    var course = (
      this.state.courses.slice(0,8).map(item => (
          <Col
            l={3}
            m={3}
            s={12}
          >
            <Link to={`/course/${item.slug}`}>
              <Card
                closeIcon={<Icon>close</Icon>}
                header={<CardTitle image={item.thumbnail}></CardTitle>}
                revealIcon={<Icon>more_vert</Icon>}
              >
                { item.title }<br />
                <div style={{bottom: "0px"}}>Rp. { item.final_price }</div>
              </Card>
            </Link>
          </Col>
      ))
    )
    return course;
  }

  getCourse_nolimit = () => {
    var course = (
      this.state.courses.map(item => (
          <Col
            l={3}
            m={3}
            s={12}
          >
            <Link to={`/course/${item.slug}`}>
              <Card
                closeIcon={<Icon>close</Icon>}
                header={<CardTitle image={item.thumbnail}></CardTitle>}
                revealIcon={<Icon>more_vert</Icon>}
              >
                { item.title }<br />
                <div style={{bottom: "0px"}}>Rp. { item.final_price }</div>
              </Card>
            </Link>
          </Col>
      ))
    )
    return course;
  }

  getSlider2 = () => {
    var slider = (
        <div>
          <Carousel items={this.state.banner} />
        </div>
    )
      return slider;
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

    // console.log("HOME SECTIONS >>> ", this.state.sections);

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
