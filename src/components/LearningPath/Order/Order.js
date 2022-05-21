import React, {Component} from 'react';
import {Button} from 'react-materialize'
import { FormatPrice } from '../../Util';
import {notify} from 'react-notify-toast';
import '../../../styles/new-style.css';
import Page from '../../Page';

class Order extends Page {
    handleSubmitOrder = () => {
        this.props.history.push('/learning-path/uuid/pending');
    }

    render() {
        return (
            <div className="container">
                <div className="payment-page">
                    <div className="payment-page-top">
                        <a className="payment-page-top-icon" onClick={() => this.props.history.goBack()}>
                            <i className="material-icons">keyboard_backspace</i>
                        </a>
                        <span className="strong">Pembayaran</span>
                    </div>
                    <form autocomplete="off" onSubmit={this.handleSubmitOrder}>
                        <section className="payment-input-voucher">
                            <div className="payment-input-voucher-inner">
                                <input placeholder="Kode Voucher" type="text" />
                                <Button className="btn btn-pa">Gunakan</Button>
                            </div>
                            {/* <div className="payment-voucher-message font-green">Potongan Voucher
                                &nbsp;
                                {FormatPrice(50000)}
                                <br/>
                            </div> */}
                            <br />
                        </section>
                        <section className="payment-detail">
                            <div className="payment-section-title">Detail</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Marketing</td>
                                        <td>{FormatPrice(172000)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>    
                                    <tr>
                                        <td>Total</td>
                                        <td className="strong">
                                            <strong>{FormatPrice(172000)}</strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        <br /> <br />

                        <section className="payment-select-method">
                            <div className="payment-section-title">Metode Pembayaran</div>
                            <select>
                                <option>Bank Transfer</option>
                                <option>Midtrans</option>
                            </select>
                            <br />
                        </section>

                        <Button
                            onClick={this.handleSubmitOrder}
                            id="enroll-btn"
                            className="btn btn-pa full-width-buttons">
                            Lanjutkan
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Order;