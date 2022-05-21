import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_JOURNEY_BASE_URL, API_COMMUNITY_BASE_URL, API_SEARCH, FormatPrice , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon, Tabs, Tab } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import Waypoint from 'react-waypoint';
import {trans} from '../Lang';
import {LearningPathItem} from '../LearningPath/Catalog'

class CommunityDetail extends Page {
  static LIMIT = 20;
  static TAB_COURSE = 0;
  static TAB_LEARNING_PATH = 1;

  constructor(props) {
      super(props);
      let params = QueryParam();

        if (!params["time"]) {
          params["time"] = 0;
        }

      this.state = {list: [], params : params, data : null, uuid: props.match.params.uuid, offset : 0, end : false, tab : CommunityDetail.TAB_COURSE};
  }

  componentDidMount() {
      $.getJSON(API_COMMUNITY_BASE_URL + "/" + this.state.uuid)
      .then((data) => {
        this.setState({ data: data.payload });
      });

      this.handleLoadData(1);
  }

  changeTab(tab, e) {
    let newTab = $(".tab .active").parent().index();
    this.setState({tab : newTab});
    this.handleLoadData(1, this.state.params, newTab);
  }

  componentWillReceiveProps(props) {
    let params = QueryParam();
    this.setState({params : params});
    this.handleLoadData(1, params);
  }

    handleLoadData = (reset, params, tab) => {
      if (!params) {
        params = this.state.params;
      }

      if (tab == null) {
        tab = this.state.tab;
      }

      params["limit"] = CommunityDetail.LIMIT;

      if (reset) {
        params["offset"] = 0;
        this.setState({list : [], offset : params["offset"], end : false});
      } else {
        params["offset"] = this.state.offset;
      }

      this.toggleLoading(1);

      let apiUrl = API_SEARCH;

      if (tab == CommunityDetail.TAB_LEARNING_PATH) {
        apiUrl = API_JOURNEY_BASE_URL;
      }



      $.get(apiUrl + "?community_uuid=" + this.state.uuid, params)
      .then((result) => {

        if (!params["offset"]) {
          var list = result.payload;
        } else {
          var list = this.state.list;
          list.push(...result.payload);
        }

          if (result.payload.length == 0 || result.payload.length < CommunityDetail.LIMIT) {
            this.setState({end : true});
          }

        this.setState({ list: list, offset: params["offset"] + CommunityDetail.LIMIT });
        this.toggleLoading();
      });
  }

  toggleLoading(on) {
    if (on) {
      $(".load-more").show();
    } else {
      $(".load-more").hide();
    }
  }

  handleFilterType = (e) => {
    let params = this.state.params;
    params["type"] = e.target.value;
      this.setState({params : params});
      this.handleLoadData(1);
  }

  _loadMoreContent = (e) => {
      if (!this.state.end) {
          this.handleLoadData();
        }
  }


    render() {
      var list = this.state.list;
      var params = this.state.params;
      var data = this.state.data;
      var tab = this.state.tab;

      return <div>
      <div className="community-detail-explanation">
        <div className="container padl-s hide">
          {data && <span className="font-white left font-medium valign-wrapper mt-s"><Link to={`/`}><Icon small className="icon-comm">home_material</Icon></Link>&emsp;<Icon small className="icon-course">keyboard_arrow_right_material</Icon>&emsp;<Link to={`/community/catalog`}>Komunitas</Link>&emsp;<Icon small className="icon-course">keyboard_arrow_right_material</Icon>&emsp;{data.title}</span> }
        </div>
        <div className="container pad-m padl-0 font-white padb-s padl-110">
          <Row>
            <Col m={3}></Col>
            <Col m={9} s={12}>
              <span className="font-medium">Komunitas</span>
              {data && <h4 className="font-white mb-0 padtb-s ellipsis hidden-overflow mh-78">{data.title}</h4> }
              {data && <div className="left valign-wrapper font-white mt-xs"><Icon tiny className="icon-course">supervisor_account_material</Icon> {data.members_count} Akademia&emsp;</div> }
              {data && <div className="valign-wrapper font-white padl-s mt-xs"><Icon tiny className="icon-course">book_material</Icon> {data.courses_count} {trans.course_item}</div> }
            </Col>
          </Row>
        </div>
      </div>
      <div className="description">
        <div className="container pad-m padl-0 padb-0">
          <Row>
            <Col m={3} s={12}>
              <div className="mt-min-xl community-img-container center-img mb-s">
                {data && <Image src={data.thumbnail} className="square-responsive full relative" />}
              </div>
            </Col>
            <Col m={9}>
              {data && <div className="justify padl-35 mb-s">{data.description}</div> }
            </Col>
          </Row>
        </div>
      </div>

      <div className="description">
        <Tabs onChange={this.changeTab.bind(this)} className="no-shadow container-xsmall">
          <Tab title={trans.course_item}>

          </Tab>
          <Tab title={trans.learning_path}></Tab>
        </Tabs>

        <div className="bg-grey"><Row className="container pt-m mb-0">
            <Col m={3} s={12} className="mb-m">
              <h5 className="mb-m valign-wrapper"><Icon className="mr-xs" small>tune</Icon>Filter</h5>
              <div className="strong mb-s">Urutkan Berdasarkan</div>
              <Input onChange={this.handleFilterType} name='type' value="" type='radio' label='Terbaru' className='with-gap' checked={!this.state.params.type} />
            <br/ ><br/ >
            <Input onChange={this.handleFilterType} name='type' value="1" type='radio' label='Terpopuler' className='with-gap' checked={this.state.params.type == 1} />
            </Col>
            <Col m={9} s={12} className="mb-xl">
              {params.query && <h5 className="mb-m"><span className="font-grey">Search Result for : </span>{params.query}</h5> }
              {!params.query && data && <h5 className="mb-m">Jelajah {tab == CommunityDetail.TAB_COURSE ? trans.course : trans.learning_path} Komunitas {data.title}</h5>}
            {list.length === 0 && this.state.end && <span>{trans.course} {trans.not_found}</span> }

          {list.length > 0 && list.map((item, i) => {
            return tab == CommunityDetail.TAB_COURSE ? <CourseItem data={item} /> : <LearningPathItem data={item} />
            }
          )}

                <Waypoint onEnter={this._loadMoreContent} />

                {!this.state.end &&
                <div className="center load-more mt-m">
                  <Preloader size='medium'/>
                </div>
              }
              </Col>
            </Row></div>
      </div>

        </div>
  }
}

class CourseItem extends React.Component {

  render() {
    let data = this.props.data;
    let className = this.props.className;

    return (
      <Link to={`/course/${data.slug}`}>
        <div className={className || "bg-white pad-m mb-s section-card hoverable"}>
          <Image src={data.thumbnail} className="square" />
          <div className="content">
            <h5 className="ellipsis hidden-overflow mh-40">{data.title}</h5>
            <div className="font-grey">{data.instructor}</div>
            {data.enrolled && <span className="font-orange"><br/>Sudah terdaftar</span>}
            {!data.enrolled && <span className="font-orange"><br/>{data.price ? FormatPrice(data.price) : "FREE"}</span>}
          </div>
        </div>
      </Link>
    )
  }
}

export default CommunityDetail
export {CourseItem}
