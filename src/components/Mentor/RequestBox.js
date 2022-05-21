import $ from 'jquery';
import React from 'react';
import Clipboard from 'react-clipboard.js';
import { Col, Row } from 'react-materialize';
import { copy } from '../../assets';

class RequestBox extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.copySuccess = this.copySuccess.bind(this);
    }

    copySuccess = (e) => {
        window.Materialize.toast("Kode berhasil disalin!", 5000);
        $('.clipboard-copy').attr("disabled", true);
        const enableCopy = () => $('.clipboard-copy').attr("disabled", false);
        setTimeout(enableCopy, 5000);
    }

    disableElement = (element_name, is_disabled) => $(element_name).attr("disabled", is_disabled);

    render() {
        const { id_paytren, expired_date_greg, expired_date_hijri, is_accepted, user_code } = this.props;
        const red_color = { color: 'red'};
        const gray_color = { color: '#828282' };
        const green_color = { color: '#27ae60' };
        const light_black_color = { color: '#4f4f4f' };

        let request_code_div = <Row className="request-code-div">
                                            <Col id="div-code" l={4} m={4} s={4}>                                  <h6 className="kkm-head">KKM</h6>
                                                <b className="kkm-codes">{user_code}</b>
                                            </Col>
                                            <Col l={8} m={8} s={8}>
                                                <Clipboard data-clipboard-text={user_code} className="clipboard-copy" onSuccess={this.copySuccess}>
                                                <div className="valign-wrapper copy-button" id="div-copy">
                                                    <div className="copy-button-div">
                                                        <img src={copy} alt=""/>
                                                    </div>
                                                    <br/>
                                                    <div className="copy-button-div">
                                                        {/*<a onClick={this.copyClick} className="font-orange-red">Salin</a>*/}
                                                        <span className="font-orange-red">Salin</span>
                                                    </div>
                                                </div>
                                            </Clipboard>
                                            </Col>
                                </Row>;

        return(
            <div className="bg-white request-box">
                                    <Row>
                                        <Col l={5} m={5} s={5}>
                                            <h6 className="kkm-head">ID Paytren</h6>
                                            <b className="kkm-codes">{id_paytren}</b>
                                        </Col>
                                        <Col l={7} m={7} s={7} className="valign-wrapper request-code">
                                        { request_code_div }
                                        </Col>
                                    </Row>
                                    { !is_accepted && is_accepted !==1 &&
                                        <div>
                                            <span id="request-expired-date" style={ gray_color }>Expired:</span>
                                            <br/>
                                            <span>
                                             {expired_date_hijri}
                                            </span>
                                            &nbsp;
                                            <span className="font-heavy" style={ light_black_color }>
                                             ({expired_date_greg})
                                            </span>
                                        </div>

                                    }
                                    { is_accepted === 1 &&
                                        <span id="request-expired-date" style={red_color}>
                                            Dibatalkan
                                        </span>
                                    }
                                    { is_accepted === 9 &&
                                        <span id="request-expired-date" style={green_color}>
                                            Berhasil Digunakan
                                        </span>
                                    }
            </div>
        );
    }
}

export default RequestBox;
