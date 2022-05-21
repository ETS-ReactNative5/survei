import React, { Component } from 'react';
import { FormatPrice, FormatDateIndo } from '../../Util';
import { Link } from 'react-router-dom';
import Page from '../../Page';

class TransactionVerified extends Page {
    render() {
        return (
            <div className="transaction-page">
				<div className="mt-sxs">
                    <section className="transaction-pipe center-align">
                        <div className="transaction-pipe-item">
                            <div className="pipe-item-bullet bg-dark"></div>
                            <div className="pipe-item-line bg-dark"></div>
                            <div className="pipe-item-title font-dark">Pembayaran</div>
                        </div>
                        <div className="transaction-pipe-item">
                            <div className="pipe-item-bullet bg-dark"></div>
                            <div className="pipe-item-line bg-dark"></div>
                            <div className="pipe-item-title font-dark">Menunggu Konfirmasi</div>
                        </div>
                        <div className="transaction-pipe-item">
                            <div className="pipe-item-bullet bg-dark"></div>
                            <div className="pipe-item-title font-dark">Siap Belajar</div>
                        </div>
                    </section>

                    <section className="transaction-success center">
                        <img className="mb-xss" src="/img/white-label/icons/popup_berhasil.svg" />
                        <div className="transaction-section-title strong">Transaksi Anda Berhasil</div>
                        <span>Modul Anda Telah Siap !</span>
                    </section>

                    <section className="transaction-detail">
                        <div className="transaction-section-title strong">Detail Pemesanan</div>
                        <table className="table-detail-main">
                            <tr>
                                <td>Pemesan</td>
                                <td>Ummi Asyifa</td>
                            </tr>
                            <tr>
                                <td>Nomor Tagihan</td>
                                <td>20191218/17550220004421</td>
                            </tr>
                            <tr>
                                <td>Tanggal Pembelian</td>
                                <td>18 Desember 2019</td>
                            </tr>
                            <tr>
                                <td>Item</td>
                                <td></td>
                            </tr>
                        </table>
                        <table className="table-detail-item">
                            <tbody>
                                <tr>
                                    <td>Cara Bentuk Tim untuk Kru Film</td>
                                    <td>{FormatPrice(26000)}</td>
                                </tr>
                                <tr>
                                    <td>Kode Unik</td>
                                    <td>{FormatPrice(22)}</td>
                                </tr>
                            </tbody>
                            <tfoot className="strong">    
                                <tr>
                                    <td>Total</td>
                                    <td>{FormatPrice(26022)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                    <section className="transaction-pending floating-section">
                        <Link
                            to={"/course/catalog"}
                            className="btn btn-pa full-width-buttons">
                            Jelajahi Modul
                        </Link>
                    </section>
                </div>
            </div>
        );
    }
}

export default TransactionVerified;