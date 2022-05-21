import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_COMMUNITY_BASE_URL , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import Waypoint from 'react-waypoint';
import {trans} from '../Lang';

class CommunityCatalog extends Page {
  static LIMIT = 10;

  constructor(props) {
      super(props);
      let params = QueryParam();

        if (!params["time"]) {
          params["time"] = 0;
        }

      this.state = {list: [], params : params, offset : 0, end : false};
  }

  componentDidMount() {
      this.handleLoadData(1);
  }

  componentWillReceiveProps(props) {
    let params = QueryParam();
    this.setState({params : params});
    this.handleLoadData(1, params);
  }

    handleLoadData = (reset, params) => {
      if (!params) {
        params = this.state.params;
      }

      params["limit"] = CommunityCatalog.LIMIT;

      if (reset) {
        params["offset"] = 0;
        this.setState({list : [], offset : params["offset"], end : false});
      } else {
        params["offset"] = this.state.offset;
      }

      this.toggleLoading(1);

      $.get(API_COMMUNITY_BASE_URL, params)
      .then((result) => {   

        if (!params["offset"]) {
          var list = result.payload;
        } else {
          var list = this.state.list;
          list.push(...result.payload);
        }

          if (result.payload.length == 0 || result.payload.length < CommunityCatalog.LIMIT) {
            this.setState({end : true});
          }

        this.setState({ list: list, offset: params["offset"] + CommunityCatalog.LIMIT });
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

      if(list.length > 0) {
        var communities = [];

        list.map((item, i) => 
          communities.push(<CommunityItem data={item} />)
            );
      }

      // var size = 4;
      // var rows = communities.map(function(content) {
      //     return <Col m={3} s={12}>{content}</Col>;
      // }).reduce(function(r, element, index) {
      //     index % size === 0 && r.push([]);
      //     r[r.length - 1].push(element);
      //     return r;
      // }, []).map(function(rowContent) {
      //     return <Row>{rowContent}</Row>;
      // });

      return <div>
      <div className="community-explanation">
        <div className="container">
          <span className="font-white left font-medium valign-wrapper mt-sxs mb-s"><Link to={`/`}><Icon small className="icon-course">home_material</Icon></Link>&emsp;<Icon small className="icon-course">keyboard_arrow_right_material</Icon>&emsp;Komunitas</span>
        </div>
        <div className="container pb-m pt-xxl font-white">
          <h4 className="font-white">Komunitas</h4>
          <span>Belajar bersama lebih baik</span>
        </div>
      </div>
      <div className="description">
        <div className="container pad-l">
          <Row>
            <Col m={9}>
              <div className="justify">Bergabung dengan komunitas, Akademia akan mendapatkan banyak {trans.course} eksklusif dari komunitas yang Anda ikuti. Akademia juga bisa mendapatkan sertifikasi khusus, atau mengikuti event-event yang diadakan oleh komunitas-komunitas yang tergabung dengan Skydu Indonesia.</div>
            </Col>
            <Col m={3} className="center-img">
              <div className="pad-xs-m ml-90"><Link to={`/community/register`} className="btn font-small right mt-xxs">JOIN KOMUNITAS</Link></div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="padl-70">
      
      <Row className="container pt-m">
        {list.length === 0 && this.state.end && <div className="pad-xl center">
          <img src={BASE_URL + "/img/profile/ic-riwayat.png"} /><br/><br/>
          <div className="strong font-grey">Belum ada komunitas aktif untuk saat ini</div> 
        </div>
        }


          {params.query && <h5 className="mb-m"><span className="font-grey">Search Result for : </span>{params.query}</h5> }

        {list.length > 0 && list.map((item, i) => 
        <CommunityItem data={item} />
            )}
      
            <Waypoint onEnter={this._loadMoreContent} />

            {!this.state.end &&
            <div className="center load-more mt-m">
              <Preloader size='medium'/>
            </div>
          }
        </Row></div>
        </div>
  }
}

class CommunityItem extends React.Component {

  render() {
    let data = this.props.data;
    let className = this.props.className;

    return (
      <Col m={3} s={10} className="mb-m">
      <Link to={`/community/${data.uuid}`}>
        <div className="section-item pad-s bg-white mr-s hoverable" style={{height : '210px'}}>
          <Image captions={<div><Icon className="left" small>school</Icon> instructor</div>} className="medium circle center mt-xss mb-xss" src={data.thumbnail} />
          <div className="center"><h5 className="ellipsis hidden-overflow light" style={{height : '40px'}}>{data.title}</h5></div>
          <div className="left valign-wrapper font-grey"><Icon tiny className="icon-course">supervisor_account_material</Icon> {data.members_count} Akademia</div>
          <div className="right valign-wrapper font-grey"><Icon tiny className="icon-course">book_material</Icon> {data.courses_count} {trans.course}</div>
        </div>
      </Link>
      </Col>
    )
  }
}

export default CommunityCatalog
export {CommunityItem}
