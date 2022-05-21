import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_CATEGORY, API_TRX, FormatPrice, FormatDateIndo } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon } from 'react-materialize'
import {EventItem} from '../Event/Catalog';
import {CourseItem} from '../Course/Catalog';
import { Link } from 'react-router-dom'
import Image from '../Image';
import TransactionConstants from './Constants';
import {trans} from '../Lang';
import Waypoint from 'react-waypoint';
import Sticky from 'react-sticky-el';
import { duration } from 'moment';
import { relative } from 'path';

class TransactionList extends Page {
	static LIMIT = 10;

	constructor(props) {
	  super(props);
	  this.state = {
      list : [], 
      loading : true, 
      page : 1, 
      end : false, 
      status : '', 
      total : null,
      isActiveButtomSheet: false
    };
	}

	componentDidMount() {
    this.handleLoadlist(1);
	}

  handleFilterStatus = (e) => {
    this.setState({
      status : e.target.value,
      isActiveFilterPopup: false,
      isActiveButtomSheet: false
    }, () => {this.handleLoadlist(1)});
  }

  handleLoadlist = (reset) => {
    let {page, list, status} = this.state

    if (reset) {
      page = 1;
      this.setState({list : [], page : page, end : false});
      list = []
    }

    this.setState({loading : true})

    $.getJSON(API_TRX, {page : page, per_page : TransactionList.LIMIT, status : status})
    .then((result) => {   
      list.push(...result.data);

      if (result.data.length == 0 || result.data.length < TransactionList.LIMIT) {
          this.setState({end : true});
      }

      //console.log(result);
      this.setState({list: list, page : page + 1, loading : false, total : result.total_row});
    });
    
  }

  _loadMoreContent = (e) => {
    if (!this.state.end) {
      this.handleLoadlist();
    }   
  }
  
  detectScroll = () => {
    $(window).scroll(function() {
      let scrollTop = $(window).scrollTop();
      let documentHeight = $(document).height() - $(window).height() - 400;

      if (documentHeight < 568) {
        if (scrollTop > documentHeight + 130) {
          $('.filter-mobile-view').fadeOut(500);
        } else {
          $('.filter-mobile-view').fadeIn(500);
        }
      } else {
        if (scrollTop > documentHeight) {
          $('.filter-mobile-view').fadeOut(500);
        } else {
          $('.filter-mobile-view').fadeIn(500);
        }
      }
    })
  }

  render() {
    let {list, loading, end, total, isActiveButtomSheet, isShowFilterButton} = this.state;

    if (!list) {
      return super.render();
    }
    
    this.detectScroll();

  	return (
      <div>
        <div className="bg-maroon pad-l">
          <div className="container pad-m-s">
            <h4 className="font-light font-white">{trans.my_transaction}</h4>
          </div>
        </div>

        <div className=".content">
          <Row className="container pt-sm">

            {/* Transaction Filter Desktop View */}
            <Col m={4} s={12} className="mb-m hide-on-mobile-view">
              <Sticky boundaryElement=".pt-sm" hideOnBoundaryHit={false} topOffset={-30} bottomOffset={-40} stickyStyle ={{"paddingTop" : "30px"}}>

                <h5 className="mb-m valign-wrapper"><Icon className="mr-xs" small>tune</Icon>{trans.filter}</h5>

                <Input id="all-status" onChange={this.handleFilterStatus} name='status' type='radio' value='' label="Semua" className='with-gap' checked={this.state.status === ''} /><br/><br/>

                {TransactionConstants.STATUSES.map((status) => 
                  <span>
                    <Input onChange={this.handleFilterStatus} name='status' value={status} type='radio' label={TransactionConstants.statusLabel(status)} className='with-gap' checked={this.state.status == status && this.state.status !== ''} />
                    <br /><br />
                  </span>
                  )}
              </Sticky>
            </Col>
            {/* End Transaction Filter Desktop View */}

            {/* Transaction Filter Mobile View */}
            <div className="filter-mobile-view hide-on-desktop-view">
              <button className="filter-button" onClick={() => this.setState({isActiveButtomSheet: true})}>
                <Icon className="filter-button-icon" small>filter_list</Icon>
                <span className="filter-button-text">Filter</span>
              </button>
            </div>

            <div className={isActiveButtomSheet ? "buttom-sheet hide-on-desktop-view active" : "buttom-sheet hide-on-desktop-view"}>
              <div className="buttom-sheet-background" onClick={() => this.setState({isActiveButtomSheet: false})}></div>
              <div className="buttom-sheet-wrapper">
                <div className="buttom-sheet-top">
                  <div className="buttom-sheet-title">Filter</div>
                  <button className="buttom-sheet-icon" onClick={() => this.setState({isActiveButtomSheet: false})}>
                    <Icon small>clear</Icon>
                  </button>
                </div>
                <div className="buttom-sheet-content">
                  <Input 
                    onChange={this.handleFilterStatus} 
                    name='status2' 
                    type='radio' 
                    value='' 
                    label="Semua" 
                    className='with-gap' 
                    checked={this.state.status === ''} />
                  {TransactionConstants.STATUSES.map((status) => 
                    <Input 
                      onChange={this.handleFilterStatus} 
                      name='status2' value={status} 
                      type='radio' 
                      label={TransactionConstants.statusLabel(status)} 
                      className='with-gap'
                       checked={this.state.status == status && this.state.status !== ''}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* End Transaction Filter Mobile View */}

            <Col s={12} m={12} l={8} className="mb-xl">
              {list && list.map((transaction, i) => 
                <TransactionItem list={transaction} />
              )}

              {/* <Waypoint onEnter={this._loadMoreContent} */}
              {!end &&
                <div className="center">
                  <a onClick={this._loadMoreContent} className="btn btn-small btn-outline">Show More ({(total - list.length) >= 10 ? 10 : (total - list.length)})</a>
                </div>
              }

              {!end && loading &&
              <div className="center load-more mt-m">
                <Preloader size='medium'/>
              </div>
              }
            </Col>
            {list.length == 0 && !loading && 
              <div className="pad-xl center mt-s">
                <img src="img/profile/ic-riwayat.png" /><br/><br/>
                <div className="strong font-grey">{trans.my_transaction} {trans.not_found}</div> 
              </div>
            }
          </Row>
        </div>
      </div>
    )
	}
}

class TransactionItem extends React.Component {

  render() {
    let list = this.props.list;
    var subscription = store.get('subscription');
    let itemLabel = "";
    let url = `/transactions/${list.uid}`;
    let uuid = list.purchasable_uuid;
    let priceLabel = FormatPrice(list.grand_total);
    let statusLabel = <span className="green-text capitalize">{trans.success}</span>

    
    if (list.status == TransactionConstants.STATUS_REJECTED || list.status == TransactionConstants.STATUS_EXPIRED) {
      statusLabel = <span className="red-text capitalize">{TransactionConstants.statusLabel(list.status)}</span>
    } else if ((list.status == TransactionConstants.STATUS_PENDING) || (list.status == TransactionConstants.STATUS_QUEUED)) {
      statusLabel = <span className="orange-text capitalize">{TransactionConstants.statusLabel(list.status)}</span>
    } else if (list.status == TransactionConstants.STATUS_CONFIRMED) {
        statusLabel = <span className="blue-text capitalize">{TransactionConstants.statusLabel(list.status)}</span>
    }
    
    //console.log(subscription);
    // console.log("LIST >>> ", list);
    // console.log("STATUS LABEL >>> ", statusLabel);
    // console.log("CONSTANTS >>> ", TransactionConstants);
    
    if (list.purchasable_type == TransactionConstants.TYPE_COURSE) {
      itemLabel = trans.course; 
      // url = `/course/${uuid}`;
    } else if (list.purchasable_type == TransactionConstants.TYPE_EVENT) {
      itemLabel = "Event"; 
      // url = `/event/${uuid}`;
    } 

    return (
      <Link to={url} className="transaction-item hoverable block bg-white mb-s pad-m section-card border-bottom">

        {/* Start Transaction - Desktop View */}
        <div className="hide-on-mobile-view">
          <Image src={list.item_image_url} className="square" />
          <div className="content">
            {priceLabel == "Rp0" && 
              <h5 className="right blue-text">Gratis</h5>
            }
            {priceLabel != "Rp0" && 
              <h5 className="right font-orange">{priceLabel}</h5>
            }
            <h5>{itemLabel} {list.item_name}</h5>  
            <div className="strong mb-s font-grey">Invoice Number : {list.invoice_number}</div>
            
            {(list.status == TransactionConstants.STATUS_VERIFIED) && 
            <div className="font-grey mb-s">{FormatDateIndo(list.created_at)}</div>
            }
            
            {(list.status != TransactionConstants.STATUS_VERIFIED) && 
            <div className="font-grey mb-s">{FormatDateIndo(list.created_at)}</div>
            }
          </div>
        
          { (subscription.is_active === false ||
            (list.status !== TransactionConstants.STATUS_VERIFIED) || 
            (list.item_type !== TransactionConstants.TYPE_MODULE_SUBSCRIPTION)) &&

            <div className="right-align mnb-xs strong" style={{fontSize : "1vw"}}>{statusLabel}</div>
          }

          { subscription.is_active != false 
            && (list.status == TransactionConstants.STATUS_VERIFIED) 
            && (list.item_type == TransactionConstants.TYPE_MODULE_SUBSCRIPTION) &&
            <div>
              <div className="right-align mnb-xs strong" style={{fontSize : "1vw"}}>{statusLabel}</div>
              <div className="valign-wrapper" style={{display: 'none'}}>
                <h5 style={{width : "18%", fontSize : "1vw", margin : 0}}>Aktif Sampai: </h5>
                <div className="green-text mnb-xs strong" style={{width : "30%", fontSize : "1vw", margin : 0}}>{FormatDateIndo(list.started_at == null ? list.created_at : list.started_at)}</div>
                <div className="right-align mnb-xs strong" style={{width : "52%", fontSize : "1vw", margin : 0}}>{statusLabel}</div>
              </div>
            </div>
          }
        </div>
        {/* End Transaction - Desktop View */}
        
        {/* Start Transaction - Mobile View */}
        <div className="hide-on-desktop-view">
          <div className="content">
            <div className="content-top">
              <Image src={list.item_image_url} className="square" />
              <div className="content-top-left">
                <div className="content-item-name">{itemLabel} {list.item_name}</div>
                <div className="content-invoice strong font-grey mb-s">Invoice Number : {list.invoice_number}</div>
                <div className="font-grey">{FormatDateIndo(list.created_at)}</div>
              </div>
              <div className="content-top-right">
                { priceLabel == "Rp0" && <h5 className="blue-text">Gratis</h5> }
                { priceLabel != "Rp0" && <h5 className="font-orange">{priceLabel}</h5> }
              </div>
            </div>
            <div className="content-bottom">
              { (subscription.is_active === false ||
                (list.status !== TransactionConstants.STATUS_VERIFIED) || 
                (list.item_type !== TransactionConstants.TYPE_MODULE_SUBSCRIPTION)) &&

                <div>
                  <div className="content-bottom-left">
                    <div className={"mnb-xs strong"}>{statusLabel}</div>
                  </div>
                </div>
              }
              { subscription.is_active !== false &&
                (list.status === TransactionConstants.STATUS_VERIFIED) && 
                (list.item_type === TransactionConstants.TYPE_MODULE_SUBSCRIPTION) &&
                <div>
                  <div className="content-bottom-left">
                    <div className={"mnb-xs strong"}>{statusLabel}</div>
                  </div>
                  {/* <div className="content-bottom-right" style={{display: 'none'}}>
                    <div>Aktif Sampai:</div>
                    <div className="green-text mnb-xs strong">{FormatDateIndo(list.started_at == null ? list.created_at : list.started_at)}</div>
                  </div> */}
                </div>
              } 
            </div>
          </div>
        </div>
        {/* End Transaction - Mobile View */}
      </Link>
    )
  }
}

export default TransactionList
