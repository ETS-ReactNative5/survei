import React from 'react';
import { Col, Row } from 'react-materialize';
import '../../styles/odoa.css';
import moment from 'moment';
import $ from 'jquery';
//import from 'moment-hijri';

class Odoa extends React.Component {

    componentDidMount() {
        $(".loading").hide();
    }

    render() {
        const moment_hijri = require("moment-hijri");
        let current_hijri = moment_hijri().format('iD/iM/iYYYY');
        return(
            <div className="container">
                <Row className="bg-white pad-xl" id="odoa-bg-div">
                    <Col l={8} m={8} s={12} className="odoa-inner-div" id="odoa-leaderboard">
                        <div className="odoa-content" id="odoa-rankings">
                            <h3> One Day One Ayat QS. Al Waqiah </h3>
                            Daftar Setoran Hafalan Al - Waqiah
                            tanggal : <b>{current_hijri} H</b> ({moment().format('DD/MM/YYYY')} M)
                            <br/>
                            <br/>
                            <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTASbCxM4R2zKny57ibuNXfroVeJcJHkDokh02XlbCoWtN3oOwLBYQVcPLADWe43POCdBo5k5k_t1HU/pubhtml?gid=1743729991&amp;single=true&amp;widget=false&amp;headers=false&amp;chrome=false"></iframe>
                        </div>


                        <div className="odoa-content" id="odoa-rankings">
                            <h3> Activities </h3>

                            <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTASbCxM4R2zKny57ibuNXfroVeJcJHkDokh02XlbCoWtN3oOwLBYQVcPLADWe43POCdBo5k5k_t1HU/pubhtml?gid=368209453&amp;single=true&amp;widget=false&amp;headers=false&amp;chrome=false"></iframe>
                        </div>

                        <b>*</b> Setelah 5 menit, Silakan <i>refresh</i> browser anda untuk melihat update terbaru.
                    </Col>
                    <Col l={4} m={4} s={12} className="odoa-inner-div" id="odoa-info">
                        <div id="odoa-info">
                            <table id="odoa-info-tables">
                                <tr>
                                    <td className="odoa-info-titles">Periode Lomba</td>
                                </tr>
                                <tr>
                                    <td className="odoa-info-row">
                                        Periode setoran:
                                        <br/>
                                            <span className="odoa-period-info"> <b>13 Jumadil Akhir - 26 Syawal 1440 H</b></span>
                                            <span className="odoa-period-info"> (16 Feb - 30 Jun 2019) </span>
                                        <br/>
                                        <br/>
                                        Periode klaim reward:
                                        <br/>
                                        <span className="odoa-period-info"><b>27 Syawal - 28 Dzulqadah 1440 H</b></span>
                                        <span className="odoa-period-info">(1 - 31 Juli 2019)</span>
                                        <br/>
                                        <br/>
                                        Periode pengumuman pemenang:
                                        <br/>
                                        <span className="odoa-period-info"><b>Akhir Bulan Syawal 1440 H</b></span>
                                        <span className="odoa-period-info">(Minggu pertama Juli 2019)</span>
                                    </td>
                                </tr>
                            </table>
                            <br/>
                            <table id="odoa-info-tables">
                                <tr>
                                    <td className="odoa-info-titles">Cara Mengikuti Lomba</td>
                                </tr>
                                <tr>
                                    <td>
                                        <ol>
                                            <li>Install Aplikasi Skydu Indonesia di Android Anda atau bisa buka di <a className="odoa-program-link" href="https://www.paytrenacademy.com">www.paytrenacademy.com </a></li>
                                            <li>Daftar program belajar ODOA QS. Al Waqiah ( bisa <a className="odoa-program-link" href="https://paytrenacademy.com/learning-path/f575fabd-d19d-4f7f-9727-13063821b9bc"> klik disini </a> )</li>
                                            <li>Hubungi admin (penerima setoran) untuk melakukan setoran. Setoran dapat melalui tatap muka / offline dan video call di nomor WhatsApp <b>081296182714</b> atau <b>081296182715</b></li>
                                            <li>Setoran akan dilakukan setiap hari <b>Sabtu & Minggu</b>, pukul <b>08.00-12.00 WIB</b></li>
                                            <li>Datang ke penyetor dan tunjukkan bukti enroll di program belajar Al-Waqi'ah</li>
                                            <li>Setorkan hafalanmu</li>
                                            <li>Lihat peringkat poinmu pada tabel di samping</li>
                                        </ol>
                                    </td>
                                </tr>
                            </table>
                            <table id="odoa-info-tables">
                                <tr>
                                    <td className="odoa-info-titles">Hadiah</td>
                                </tr>
                                <tr>
                                    <td className="odoa-info-row">
                                        <b>480 poin</b> - Buku Quantum
                                        <br/>
                                        <b>580 poin</b> - Buku Pulang Kampung
                                        <br/>
                                        <b>680 poin</b> - Buku Feel
                                        <br/>
                                        <b>780 poin</b> - Buku Kaya Lewat Jalan Tol
                                        <br/>
                                        <b>880 poin</b> - Buku Jaminan
                                        <br/>
                                        <b>980 poin</b> - Paket Buku Modul Umum
                                        <br/>
                                        <b>1080 poin</b> - Buku RKDK
                                        <br/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Odoa;
