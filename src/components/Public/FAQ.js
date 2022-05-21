import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_FAQ , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon, Button, Modal, Collapsible, CollapsibleItem } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Image from '../Image';
import Sticky from 'react-sticky-el';

class FAQ extends Page {

  constructor(props) {
      super(props);
      let params = QueryParam();
      this.state = {tab : 0, query : params.query}
  }

  componentDidMount() {
    this.handleLoadData();  
  }

  handleLoadData(month) {

    $.getJSON(API_FAQ, {month : month})
      .then((data) => {
        let sections = data.payload;
        let tab = this.state.tab;

        if (this.state.query) {
          for(let i in sections) {
            if (sections[i].title == this.state.query) {
              tab = i;
            }
          }
        }

        this.setState({ data: sections, tab : tab });
      });
  }

  render() {
    let sections = this.state.data;
    let tab = this.state.tab
    let activeSection = sections ? sections[tab] : null

    return (
      <div className="pb-m border-bottom">
        <div className="bg-banner ptb-l">
          <Row className="container valign-wrapper">
            <Col s={12}>
              <h4 className="font-white font-light">FAQ - PROGRAM KARTU PRAKERJA GETI INCUBATOR!</h4>
            </Col>
          </Row >
        </div>
        {/* <div className="mt-m container narrow"> */}
          <Row className="container valign-wrapper">
            <Col className="pad-m bg-white" s={12}>
            <div ><b>Halo, Getters!</b></div>
              <p >Terima kasih sudah memilih GeTI Incubator sebagai mitra pelatihan Kartu Prakerja Kamu. Kami memiliki komitmen untuk terus menghadirkan pengalaman belajar yang atraktif dan aplikatif untuk seluruh peserta. Kami juga berharap materi yang dihadirkan akan memberikan manfaat bagi seluruh peserta, khususnya dalam membuka peluang-peluang baru dalam bidang bisnis dan pekerjaan sehingga membantu kamu dalam meraih karier impian.</p>
              <p >Berikut kami rangkum sejumlah pertanyaan beserta jawaban yang sering ditanyakan oleh peserta terkait pelatihan Kartu PraKerja di GeTI Incubator. Untuk mendapatkan jawaban cepat dari pertanyaan umum, Kamu bisa mengecek daftar pertanyaan berikut terlebih dahulu.</p>
              <p >Apabila masih ada pertanyaan yang belum terjawab, Kamu dapat menghubungi kami di <b>www.geti.id</b>, campus.hq@geti.id atau chat via DM di Instagram. Kami sangat menyarankan untuk menghubungi admin lewat chat WhatsApp di nomor <b>081389193052</b>, karena kami akan melayani 24 jam non stop. Tim GeTI Incubator sedang berusaha semaksimal mungkin agar bisa cepat menjawab pertanyaan-pertanyaan yang masuk. Kamu tidak perlu khawatir jika belum di respon, mohon kesabarannya, Getters!</p>
            </Col>
          </Row>
        {/* </div> */}
        <div className="mt-m container narrow">
          {!sections && this.getLoadingMedium()}
          {sections && 
          <Row>
            <Col m={3} s={12} className="strong">
              <div className="pad-m-s">
              <Sticky hideOnBoundaryHit={false} boundaryElement=".narrow" topOffset={-110} stickyStyle ={{"paddingTop" : "110px"}}>
              <h5 className="black-text mb-s font-large">Daftar Isi</h5>
              {sections.map((section, i)=>
                <div className="strong font-medium mb-s"><a onClick={()=>{this.setState({tab : i});this.scrollToTop(650)}} className={i == tab ? "font-orange" : "font-grey"}>{section.title}</a></div>
              )}
              <br/><br/>
              </Sticky>
              </div>
            </Col>
            <Col className="pad-m bg-white" m={9} s={12}>
              <h5 className="font-large mb-s">{activeSection.title}</h5>
              {activeSection.contents &&
              <Collapsible className="no-border">
              {activeSection.contents.map((content, i) =>
                <CollapsibleItem expanded={i == 0} header={<div className="font-medium mr-m">{content.question}</div>} icon='keyboard_arrow_up' >
                  <div className="justify" dangerouslySetInnerHTML={{__html: content.answer}}></div>
                </CollapsibleItem>
              )}
              </Collapsible>
              }

              {!activeSection.contents && "Konten belum tersedia"}
            </Col>
         
          </Row>
          }
        </div>

      </div>
      )
  }
}

export default FAQ
