import $ from 'jquery';
import moment from 'moment';
import React from 'react';
import { Col, Collapsible, CollapsibleItem, Preloader, Row } from 'react-materialize';
import { asset_error, search } from '../../assets';
import '../../styles/mentor-list.css';
import { API_MENTEE_CODE, API_PROFILE_BASE_URL, HijriMonthNames } from '../Util';
import RequestBox from './RequestBox';

const ENTER_KEY_CODE = 13;
const NOT_MENTOR_TEXT = "Selesaikan Syarat Menjadi Mentor untuk bisa menjadi pebisnis handal";
const NO_REQUEST_TEXT = "Kamu belum memiliki daftar request KKM yang diminta oleh calon mitra";
const NO_HISTORY_TEXT = "Kamu belum memiliki daftar histori request KKM";
const NO_REQUEST_TITLE = "Belum Ada Request KKM";
const NO_HISTORY_TITLE = "Belum Ada Histori KKM";
const NOT_MENTOR_TITLE = "Kamu Belum Menjadi Mentor";
const NOT_FOUND_TITLE = "Pencarian Tidak Ditemukan";
const INIT_STATE_TEXT= "Silahkan ketikkan ID di kotak pencarian untuk menemukan calon mitra"


export const EmptyStateDiv = ({title, text, empty_state_image, ...rest}) => {
    return (
            <div id="empty-request-state" className={rest.class_name}>
                                <img src={empty_state_image} id="asset-error-img"/>
                                <h5 className="font-medium">{title}</h5>
                                <p id="empty-state-text">
                                    {text}
                                </p>
            </div>
    );
}

export const AjaxSettings = (token) => {
        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + token,
                'Access-Control-Allow-Origin': '*'
            },
            timeout: 30000,
            complete: function(xhr, status) {
                console.log(xhr.responseJSON);
            },
            error: function(xhr, status, errorThrown) {
                console.log(xhr.responseJSON);
            }
        })
    }

class MentorList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search_text: '',
            filtered_requests: '',
            retrieval_status: '',
            loading:false,
            data:""
        };
        this.tabChange = this.tabChange.bind(this);
        this.enterIsPressed = this.enterIsPressed.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        AjaxSettings(this.props.match.params.token);
        // this.getProfile();
    }

    componentDidUpdate(prevProps, prevState){
        let keyword = this.state.search_text;
        let prevKeyword = prevState.search_text;
        if(prevKeyword !== keyword && !keyword) {
            this.setState({retrieval_status:''});
        }
    }

    getProfile() {
        $.getJSON(API_PROFILE_BASE_URL)
	      .then((data) => {
	        this.setState({ data: data.payload });
	    });
    }

    tabChange = (tabIndex) => {
        this.setState({tab_state:tabIndex});
    }

    updateDimensions = () => {
      this.setState({width: $(window).width(), height: $(window).height()});
    }

    componentWillMount = function() {
      this.updateDimensions();
      $(".cookieConsent").find("button").click();
    }

    loadUserIDs = (keyword) => {
        let { data } = this.state;
        $.ajax({
            method: 'GET',
            url: API_MENTEE_CODE + keyword
        }).done((res) => {
            const { responseData } = res.payload;
            console.log(data);
            this.setState({filtered_requests: responseData, retrieval_status: res.status, loading:false});
        }).fail((res) => {
            let { message, status } = res.responseJSON;
            this.setState({retrieval_status: status, filtered_requests:'', loading: false});
            $(".toast-notification").remove();
            window.Materialize.toast(message, 5000);
        });
    }

    handleKeywordChange = (e) => {
        this.setState({search_text: e.target.value})
    }

    enterIsPressed = (e) => {
        if(e.keyCode === ENTER_KEY_CODE) {
            this.performIDSearch(e.target.value);
        }
    }

    performIDSearch = (keyword) => {
        if(!keyword) {
            window.Materialize.toast("ID Paytren tidak boleh kosong", 5000);

        } else {
            this.setState({loading:true});
            this.loadUserIDs(keyword.toUpperCase());
        }
    }

    convertMonthtoHijri = (hijri_month) => {
        return HijriMonthNames[hijri_month];
    }

    componentDidMount() {
        $(".loading").remove();
        $(".navbar-fixed").remove();
        $(".page-footer").hide();
        $(".navbar-top").remove();
        $(".btn-help").hide();
        $(".collapsible-header").append("<i class='material-icons'>keyboard_arrow_down</i>");
        this.getProfile();
    }

    getRequestBox = (request) => {
        const moment_hijri = require("moment-hijri");
        const expired_date_greg = moment(request.expired_date, "DD-MM-YYYY HH:mm").format('DD MMM YYYY[, ] HH:mm [WIB]');
        let expired_hijri = moment_hijri(request);
        const expired_date_hijri = expired_hijri.format('iDD ');
        const expired_month_hijri = this.convertMonthtoHijri(expired_hijri.format('iMMM'));
        const expired_year_hijri = expired_hijri.format('iYYYY [H]');
        expired_hijri = expired_date_hijri + expired_month_hijri + " " + expired_year_hijri;
        return (
            <RequestBox
                id_paytren={request.camitId}
                expired_date_hijri={expired_hijri}
                expired_date_greg={expired_date_greg}
                user_code={request.kkm}
            />
        );
    }

    render() {
        const moment_hijri = require("moment-hijri");
        let { retrieval_status, search_text, filtered_requests, loading } = this.state;
        var isMobile = this.state.width && this.state.width < 800;
        let performIDSearch = this.performIDSearch.bind(this, search_text);
        let requirement_kkm = <Collapsible>
                                <CollapsibleItem header="Syarat Menjadi Mentor">
                                    <div className="bg-white">
                                        <div id="mentor-requirements">
                                            <ol>
                                                <li>Status kemitraan minimal Mitra Bisnis Reguler</li>
                                                <li><span>Beli modul <b>Menjadi Mentor</b> untuk mengakses Kode Konfirmasi Mentor (KKM)</span></li>
                                                <li><span>Selesaikan modul <b>Menjadi Mentor</b> untuk dapat menampilkan nama kamu di list mentor pada Aplikasi Paytren</span></li>
                                            </ol>
                                            {/*<div id="mentor-course-button">
                                                <Button>Menuju Modul Menjadi Mentor</Button>
                                            </div>*/}
                                        </div>
                                    </div>
                                </CollapsibleItem>
                        </Collapsible>;
        return(
                <div className="webview-special">
                                <div className="container">
                                    <div className="pad-small">
                                            <Row className="bg-white valign-wrapper" id="histori-kkm">
                                                <Col l={10} m={10} s={10}>
                                                        <input
                                                        onChange={this.handleKeywordChange}
                                                             onKeyDown={this.enterIsPressed}
                                                         placeholder="Cari ID Paytren" id="search-bar" value={this.state.search_text}/>
                                                </Col>
                                                <Col l={2} s={2} m={2} onClick={performIDSearch}>
                                                    <img src={search} id="search-icon"/>
                                                </Col>
                                            </Row>
                                            <br/>
                                {requirement_kkm}
                               {!loading &&
                                   <div>
                                        { filtered_requests  && this.getRequestBox(filtered_requests)}
                                        { retrieval_status === "failed" &&
                                            <EmptyStateDiv title={NOT_FOUND_TITLE} empty_state_image={asset_error}/>
                                        }
                                        { !search_text && <EmptyStateDiv text={INIT_STATE_TEXT}/>}
                                    </div>
                                }
                                    { loading &&
                                        <div className="center mt-20p">                                            <Preloader size ="medium"/>
                                        </div>
                                    }
                            </div>
                        </div>
                </div>
        );
    }
}

export default MentorList;
