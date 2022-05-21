import $ from 'jquery';
import React from 'react';
import { notify } from 'react-notify-toast';
import { API_PASSWORD_FORGET, API_BATCH , API_PRAKERJA, BASE_URL } from '../Util';
import Login from '../Auth/Login';
import { Modal } from 'react-materialize';
import "../../styles/redemVoucher.css";

class VoucherRedeem extends Login {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        voucher_code: '',
        batch_id:'',
      },
      formErrors: {
        errorVoucher: '',
      },
      gelombang: []
    }
  }

  componentDidMount() {
    this.handleLoadBatch()
  }

  handleLoadBatch(){
    $.getJSON(API_BATCH)
	    .then((data) => {
        // let {formData} = this.state;
        // let {id} = data.payload.find(({selected})=> selected===1);
        // formData.batch_id = id;
        //this.setState({ formData,gelombang: data.payload });
        this.setState({ gelombang: data.payload });
	    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.checkIsFormValid()) {
      let {voucher_code,batch_id} = this.state.formData;

      $.post(API_PRAKERJA, {"voucher_code": voucher_code,"batch_id":batch_id}).then((data) => {
        if (data.status === 'success') {
          const { invoice_number } = data.payload;
          notify.show("Kode voucher berhasil diaktifkan!", "success");
          this.props.history.push(`/transactions/${invoice_number}`);
        } else {
          notify.show("Terjadi kesalahan: " + data.message, "warning");
          let {formErrors} = this.state;
          formErrors.errorVoucher = data.message;
          this.setState(formErrors);
        }
        //this.state.formData.voucher_code = '';
      });
    }
  }

  handleChange = (e) => {
    
    let {value,name} = e.target;
    let {formData} = this.state;

    formData.voucher_code = value;

    this.setState({formData});
  }

  handleChangeBatch = (e) => {
    let {value} = e.target;
    let {formData} = this.state;

    formData.batch_id = value;

    this.setState({ formData });
    console.log(value);
  }

  checkIsFormValid = () => {
    let {voucher_code,batch_id} = this.state.formData;
    let {formErrors} = this.state;
    let isValid = true;

    if (!voucher_code) {
      formErrors.errorVoucher = "Kode voucher tidak boleh kosong";
    } else {
      formErrors.errorVoucher = "";
    }

    // if (!batch_id) {
    //   formErrors.errorVoucher = "Gelombang tidak boleh kosong";
    // } else {
    //   formErrors.errorVoucher = "";
    // }

    this.setState({formErrors});

    // RETURN ISVALID
    Object.values(formErrors).forEach((value) => {
      if (value) {
        isValid = false;
      }
    });

    return isValid;
  }

  render() {
    let {voucher_code,batch_id} = this.state.formData;
    let {errorVoucher,errorGelombang} = this.state.formErrors;
    let {gelombang}    =this.state;
    return (
      <div>
        <div className="pt-m mb-xl">
          <form id="form-forgot-password" onSubmit={this.handleSubmit} className="form-auth bg-white">
            <div className="px-l py-m inline-block full-width">
              <div className="mb-s">
                <div className="font-largest font-heavy mt-0 mb-xss">Anda punya kode voucher?</div>
                <p style={{lineHeight: '1.2em'}}>
                Jika Anda memiliki kode voucher yang didapatkan dari pembelian di e-commerce dalam program Kartu Prakerja, 
                Anda dapat melakukan aktivasi dengan cara memilih gelombang program yang diikuti dan memasukkan kode voucher tersebut pada kolom dibawah.
                </p>
              </div>
              {/* <Modal trigger={<a className="link">Di mana Saya bisa melihat kode voucher?</a>}>
                <div className="top-right-button">
                  <a className="modal-close">
                    {" "}
                    <i className="fa fa-close" />{" "}
                  </a>
                </div>
                <div className="font-large font-heavy mt-0 mb-xss">Panduan Menemukan Kode Voucher</div>
                <p style={{marginBottom:5}}>Berikut panduan untuk menemukan kode voucher Anda di aplikasi BukaLapak</p>
                <ol style={{marginTop:5, paddingLeft:15}}>
                  <li>Pada halaman awal aplikasi, pilih "Transaksi"</li>
                  <li>Lihat di "Tagihan", pilih voucher kursus untuk melihat kode voucher</li>
                  <li>Pada halaman "Detail Tagihan", klik "Lihat Kupon"</li>
                </ol>
                <div className="text-center" >
                  <img src={ BASE_URL + "/img/voucher_bl.png"} style={{maxWidth:'80%'}} />
                </div>
              </Modal> */}
              <div className="mb-s" style={{background:'#ffeb3b33',padding:'10px',borderShadow:'8px',marginTop:'20px',display:'none'}}>
                <div className="font-heavy mt-0 mb-xss" style={{marginTop:'20px'}}>
                  <p>Hallo Getters,</p>
                  </div>
                <p style={{lineHeight: '1.5em'}}>
                Sehubungan dengan aturan yang telah ditetapkan oleh pihak pelaksana prakerja, bahwa <b>batas akhir pembelian kelas pelatihan pertama menggunakan saldo prakerja adalah tanggal 9 Desember 2020.</b></p>
                <p style={{lineHeight: '1.5em'}}>Jangan lupa, <b>selesaikan pelatihan sebelum tanggal 15 Desember 2020</b> yah, agar bisa kami laporkan sebagai peserta LULUS pelatihan!
                Jika kamu masih punya voucher dari program prakerja namun <b>melebihi batas akhir pembelian</b>, kamu masih bisa redeem kelas ini namun tidak bisa dilaporkan ke pihak pelaksana prakerja sehingga <b>benefit dari program prakerja tidak bisa lagi kamu dapatkan.</b>
                </p>
                <p><b>Silahkan redeem kode voucher kamu !</b></p>
              </div>
              {/* <ComboBox /> */}
              <div className="row">
                <select className="browser-default" name="batch_id" onChange={this.handleChangeBatch} value={batch_id}>
                  <option value="" >Pilih Gelombang</option>
                  {gelombang.map((option) => (
                    <option value={option.id} >{option.name}</option>
                  ))}
                </select>
                <div className="helper-text font-orange-red inline-block font-tiny">
                  {errorGelombang}
                </div>
              </div>
              <div className="input-field row">
                <input
                  name="voucher_code"
                  type="text"
									placeholder="Masukkan kode voucher Anda"
                  className="col s12"
                  onChange={this.handleChange}
                  value={voucher_code}
                />
              </div>

              <div className="form-auth__button-group mt-s">
                <button className="btn full mb-s modal-trigger">Aktifkan Kode Voucher</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default VoucherRedeem;