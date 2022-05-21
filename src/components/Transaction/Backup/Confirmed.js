import React, { Component } from 'react';
import $ from 'jquery';
import { Button, Icon } from 'react-materialize';
import { FormatPrice, FormatDateIndo } from '../../Util';
import { notify } from 'react-notify-toast';
import Page from '../../Page';

class TransactionConfirmed extends Page {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: ''
        }
    }

    componentDidMount = () => {
        let locationState = this.props.location.state;

        if (locationState) {
            this.setState({ imageURL: locationState.imageURL || '' })
        }
    }

    render() {
        let { imageURL } = this.state;

        return (
            <div className="transaction-page mt-sxs">
				<section className="transaction-pipe center-align">
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-dark"></div>
						<div className="pipe-item-line bg-dark"></div>
						<div className="pipe-item-title font-dark">Pembayaran</div>
					</div>
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-dark"></div>
						<div className="pipe-item-line bg-grey"></div>
						<div className="pipe-item-title font-dark">Menunggu Konfirmasi</div>
					</div>
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-grey"></div>
						<div className="pipe-item-title font-grey">Siap Belajar</div>
					</div>
				</section>

                <section className="transaction-waiting-for-confirmation center">
                    <img src="/img/asset_time.svg" />
                    <div className="transaction-section-title strong">Pembayaran Sedang Diproses</div>
                    <span>Mohon tunggu, kami akan melakukan pengecekan paling lambat 2x24 jam.</span>
                </section>

                <section className="transaction-bukti-transfer">
                    <div className="transaction-section-title strong">Bukti Transfer</div>
                    <div className="bukti-transfer-bank">
                        <span>Transfer ke Bank</span>
                        <span className="bukti-transfer-bank-bankname">1234567890-1</span>
                    </div>
                    <div className="bukti-transfer-image">
                        <img src={ imageURL } />
                    </div>
                </section>
            </div>
        );
    }
}

export default TransactionConfirmed;