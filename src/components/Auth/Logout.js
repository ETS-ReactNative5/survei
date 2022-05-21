import $ from 'jquery';
import Page from '../Page';
import { API_LOGOUT, ClearUserData } from '../Util';

class Logout extends Page {
	constructor(props) {
	    super(props);
	    this.state = {data: null};
	}

	componentDidMount() {
	    this.handleLogout();
	}

  	handleLogout = () => {
		$.post(API_LOGOUT)
	      .then(async (data) => {
	      ClearUserData();
	      await this.props.history.push("/", {needRefresh: true});
		  window.location.reload()
	    });
	}

  	render() {
  		return super.render();
	}
}
export default Logout
