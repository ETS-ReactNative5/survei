import React from 'react';
import {
    Col,
    Input,
    Preloader,
    Row,
    Select,
    Table
} from 'react-materialize';
import { asset_error, pa_green, search } from '../../assets';
import '../../styles/leaderboard.css';
import {
    RecordSearch,
    GetRecordIndex,
    HijriAndGregDate,
    HijriAndGregYear,
    MONTH_ARRAY,
    getYearRangeArray
} from '../../components/Util';
import { EmptyStateDiv } from '../Mentor/MentorList';
// import Waypoint from 'react-waypoint';
import $ from 'jquery';
import Page from '../Page';
import Podium from './Podium';
import moment from 'moment';
import { withRouter } from 'react-router';


const USER_NOT_FOUND = "User Tidak Ditemukan";
const USER_NOT_FOUND_SUB = "User yang kamu cari tidak ada disini";
const NO_DATA = "Belum Ada Data";

const RankingRow = ({ranking, profpic, name, total_pac, user_id, points_currency_icon, ...rest}) => {
    return (
        <tr id={rest.id} className={"ranking-row " + rest.class_name}>
                        <td>{ranking}</td>
                        <td>
                            <div className="valign-wrapper">
                                <img className="leaderboard-profpic" src={profpic? profpic: "/img/logo-mobile.png"}/>
                                <span className="leaderboard-name">{name}</span>
                                <span className="leaderboard-userid">({user_id})</span>
                            </div>
                        </td>
                        <td className="center leaderboard-points">
                            <div className="valign-wrapper">
                                {total_pac}&nbsp;<img src={points_currency_icon} className="leaderboard-currency-icon"/>
                            </div>
                        </td>
        </tr>
    );
}

class Leaderboard extends Page {

    constructor(props){
        super(props);
        this.state ={
            search_text: "",
            rankings_data: [],
            loading: true,
            selected_period: ''
        };
        this.onTimeFilterChange = this.onTimeFilterChange.bind(this);
    }

    componentDidMount(){
        const { default_params } = this.props;
        this.loadRankingData(default_params);
    }

    loadRankingData = ( params ) => {
        let { api_url } = this.props;
        $.getJSON(api_url, params)
        .then((data) => {
            let { payload } = data;
            let result = payload.leaderboard? payload.leaderboard: payload;
            this.setState({rankings_data: result, loading: false});
        });
    }

    onTimeFilterChange = (e) => {
        const { selector } = this.props;
        let params = "";
        if (selector === "yearly") {
            params = {year: e.target.value}
        } else {
            params = {month: e.target.value, year: moment().year()}
        }
        this.setState({selected_period: params, loading:true});
        this.loadRankingData(params);
    }

    shortenNames(names){
        const names_split = names.split(" ");
        if(names_split.length > 1) {
            return names_split[0] + " " + names_split[1];
        } else {
            return names;
        }
    }

    popData(data, num_of_items=0){
        let data_temp = JSON.parse(JSON.stringify(data));
        data_temp.splice(0, num_of_items);
        return data_temp;
    }

    render() {
        let { search_text, rankings_data, loading, selected_period } = this.state;
        const { search_placeholder, target_id, points_id, selector, points_icon, default_params, podium_enabled } = this.props;
        const rankingsDisplay = (screen_width) => {
            if(screen_width < 700) {

            }
        }
        let user_data = "";
        let user_ranking = '';
        if (rankings_data && target_id) {
            user_data = RecordSearch(target_id, rankings_data, "username")[0];
            user_ranking = user_data ? GetRecordIndex(user_data, rankings_data ) + 1 : 0;
        }
        let period_selector = <Row className="valign-wrapper">
                                <Col s={1} m={1} l={1}>
                                    <i className="material-icons prefix">access_time</i>
                                </Col>
                                <Col s={11} m={11} l={11} id="leaderboard-period-select">
                                    { selector === "monthly" &&
                                        <Input type="select" id="period-select" onChange={this.onTimeFilterChange} value={selected_period.month || moment().month()}>
                                            { MONTH_ARRAY.map( (month) =>
                                                <option value={month.value} selected={default_params.month}>
                                                    {HijriAndGregDate(month.value)}
                                                </option>
                                            )}
                                        </Input>
                                    }
                                    { selector === "yearly" &&
                                        <Input type="select" id="period-select" onChange={this.onTimeFilterChange} value={selected_period.year}>
                                            { getYearRangeArray().map( (year, index) =>
                                                <option value={2017 + index + 1} selected={default_params.year}>
                                                    {HijriAndGregYear(2017 + index + 1)}
                                                </option>
                                            )}
                                        </Input>
                                    }

                                </Col>
                            </Row>


        const UserInfo = ({data}) => <div className="user-info">
            <span className="user-name">{this.shortenNames(data.name)}</span>
            <span className="user-id">({data.username})</span>
            <span className="user-points"><div className="valign-wrapper">
                <b style={{width : '50%', textAlign : 'right'}}>{data[points_id]} &nbsp; </b><img style={{height : '20px'}} src={points_icon}/></div>
            </span>
        </div>

        return(
            <div>
                <Row id="period-and-search">
                    <Col l={8} m={8} s={12} id="leaderboard-period">
                        {selector && period_selector}
                    </Col>
                    <Col l={4} m={4} s={12}>
                        <div className="ranking-search-div">
                            <Row className="valign-wrapper">
                                <Col m={10} l={10} s={10}>
                                    <Input
                                        style={{paddingBottom : '10px'}}
                                        placeholder={search_placeholder}
                                        value={search_text} className="leaderboard-search-input" onChange={ (e) => this.setState({search_text: e.target.value}) }
                                    />
                                </Col>
                                <Col m={2} l={2} s={2}>
                                    <img src={search} id="ranking-search-icon" style={{paddingBottom : '5px'}} />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                {podium_enabled && rankings_data.length > 0 &&
                    <Podium points_id={points_id} ranking_leaders={rankings_data.slice(0, 3)} />
                }
                <div className="leaderboard-table">
                    <Table>
                        {user_data && user_ranking > 0 &&
                                <RankingRow
                                    total_pac={user_data[points_id]} name={user_data.name} profpic={user_data.avatar_url} ranking={user_ranking} user_id={user_data.username}
                                    id = "current_user_row"
                                    points_currency_icon={points_icon}
                                />
                        }
                        {rankings_data && !loading && RecordSearch(search_text, rankings_data, "name").map( (leader, index) => {
                            return(
                                <RankingRow total_pac={leader[points_id]} name={leader.name} profpic={leader.avatar_url} ranking={index+1} user_id={leader.username}
                                points_currency_icon={points_icon} id={ index === 0? "first-rank" : ""} class_name={ index < 3 && podium_enabled ? "top-3" : ""}/>
                            )
                        })}
                        {rankings_data && search_text && !RecordSearch(search_text, rankings_data, "name").length &&
                            <EmptyStateDiv title={USER_NOT_FOUND} text={USER_NOT_FOUND_SUB}/>
                        }
                        {!rankings_data.length && !loading &&
                            <EmptyStateDiv title={NO_DATA} empty_state_image={asset_error}/>
                        }
                    </Table>

                    {!rankings_data.length && loading &&
                            <div id="leaderboard-preloader-div">
                                <Preloader size="big" color="red" className="leaderboard-preloader"/>
                            </div>
                    }
                </div>
                        </div>
        );
    }
}

export default withRouter(Leaderboard);
