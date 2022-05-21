import $ from 'jquery';
import React from 'react';
import ga from 'react-google-analytics';
import { Button, Preloader } from 'react-materialize';
import { notify } from 'react-notify-toast';
import { offline } from '../assets';
import '../styles/page.css';
import { AjaxSetup, CheckAuth } from './Util';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {image : {}};
    $(".loading").hide();
    AjaxSetup(props);
    this.scrollToTop();
    //console.log(props);
    this.pathChecker(props);
    ga('send', 'pageview', window.location.pathname);


    // window.onpopstate = function(e) {
    //   if ($(".modal-overlay").length > 0) {
    //     $(".modal-overlay").hide();
    //     props.history.go(1);
    //   }
    // }

  }

  pathChecker = (pageProps) => {
    const matchedPath = pageProps.match?
      pageProps.match.path : window.location.pathname;
  }

  handleInputChange = (e) => {
    let state = this.state;
    let identifier = e.target.name ? e.target.name : e.target.id

    state[identifier] = e.target.value;
    this.setState(state);

    // if (e.target.id === "password" || e.target.id === "confirm_password") {
    //   this.validatePassword();
    // }
  }

  handleImageChange = (e) => {
    let target = e.target.id;
    let form = this.refs[target];

    if (!form.files) {
      return;
    }
    var file = form.files[0];

    if (!file) {
      return;
    }

    if (file.size > 1024*1024*3) {
      notify.show("File yang diupload maksimal 3MB", "warning");
      this.refs[target].value='';
      return;
    }

    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    let image = this.state.image;

    reader.onloadend = function (e) {

      if (file.type.indexOf("image") === -1) {
        image[target] = -1;
      } else {
        image[target] = reader.result;
      }

        this.setState({
            image      : image
        })
    }.bind(this);
  }

  checkLogin(props) {
    if (!props) {
      props = this.props;
    }

    if (CheckAuth() === false) {
      $(".modal-close").trigger("click");
      notify.show("Silakan login terlebih dahulu", "warning");

      let path = window.location

      props.history.push("/login?redirect=" + window.location.pathname);
      return false;
    }

    return true;
  }

  getLoading(className, size) {
    size = size || "medium";
    return <center><Preloader className={className} size={size}/></center>
  }

  componentWillReceiveProps(props) {
    // this.scrollToTop();
  }

  componentWillMount() {
    $(".btn-help").show();
  }

  componentDidMount() {
    this.scrollToTop();
  }

  scrollToTop(offset) {
    if (!offset) {
      offset = 0;
    }
    $("html, body").animate({ scrollTop: offset });
  }

  refreshPage = (e) => {
    window.location.reload()
  }

  getLoadingMedium() {
    // return <center><Preloader className="mtb-m" size='medium'/></center>

    return <center><div className="center mtb-m">
        <Preloader size='medium'/> <h5 className="mt-ss"> Memuat Konten..</h5>
      </div></center>
  }

  render() {
    return <center>
      <div className="fullheight valign-wrapper">
        <div className="full center">
          <div className="loading">
            <Preloader size='medium'/> <h5 className="mt-ss"> Memuat Halaman..</h5>
          </div>
          <div className="center reload-page" id="reload-message-div">
            <img src={offline}/>
            <p>
                <span>Maaf, saat ini anda sedang offline.</span>
                <span>Silakan tekan tombol dibawah jika koneksi</span>
                <span>anda sudah kembali.</span>
            </p>
          </div>
          <Button node='a' onClick={this.refreshPage} className="reload-page" style={{display:'none'}}>Reload Page</Button>
        </div>
      </div>
    </center>
  }
}

export default Page
