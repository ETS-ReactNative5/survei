import React from 'react'
import SectionItems from './SectionItems'
import { Link } from 'react-router-dom'

class Section extends React.Component {
  render() {
  	var data = this.props.data;
  	let url = `course/catalog?category_id=${data.category_id ? data.category_id : 0}`;

  	if (data.type === SectionItems.TYPE_EVENT) {
  		url = `event/catalog/${data.category_id}`;
  	} else if (data.type === SectionItems.TYPE_JOURNEY) {
      url = `learning-path/catalog/${data.category_id}`;
    }

    return (
      <div className="container mb-m">
        { data.type === SectionItems.TYPE_JOURNEY
          &&
          <div>
            <h5 className="right mt-xs"><Link className="font-orange" to={url}>Lihat Semua</Link></h5>
            <h4>{data.title}</h4>  
            <SectionItems data={data} />
          </div>
        }

        { data.type !== SectionItems.TYPE_JOURNEY
          &&
          <div>
            <h5 className="right mt-xs"><Link className="font-orange" to={url}>Lihat Semua</Link></h5>
            <h4>{data.title}</h4>
            <SectionItems data={data} />
          </div>
        }
      </div>
    )
  }
}

export default Section
