import React from 'react'
import $ from "jquery"
import Page from "../Page";
import { API_COURSE_BASE_URL } from "../Util";

class ViewMateri extends Page {
   constructor(props) {
      super(props);
      this.state = {   
       slug_kelas: this.props.location.pathname.slice(8),
       link_materi:''
       
      }
   }

   componentDidMount() {
      this.handleLoadData()
   }
   
   handleLoadData() {
      return $.get(API_COURSE_BASE_URL + this.state.slug_kelas).then((data) => {
         this.setState({
            link_materi: data.payload.course_material,
			});
      })
   }
   
   render() {
      let url = this.state.link_materi
      return(
         <div>
            {
               this.state.link_materi ? 
                  <iframe src={`/js/ViewerJS/index.html#${url}`} className="pdf" frameBorder="0" allowfullscreen></iframe>
               :
                  ""
            }
         </div>
      )
   }
}

export default ViewMateri;