import React from 'react'
import { podiums, pa_green } from '../../assets';
import '../../styles/podium.css';

class Podium extends React.Component {

    generatePodium({user, ranking}){
        console.log(ranking);
        return(
            <div id={"div-" + ranking} className="podium">
                <div className="podium-seaters" id={"seat-" + ranking}>
                    <div>
                        <img src={user.avatar_url ? user.avatar_url : "/img/logo-mobile.png"} className="user-profpic"/>
                    </div>
                    <div className="user-info">
                        <span className="user-name">{this.shortenNames(user.name)}</span>
                        <span className="user-id">({user.username})</span>
                        <span className="user-points">{user[this.props.points_id]} <img className="inverted-colors" src={pa_green}/></span>
                    </div>
                </div>
                <img src={podiums["step_" + ranking]}/>
            </div>
        );
    }
    shortenNames(names){
        const names_split = names.split(" ");
        if(names_split.length > 1) {
            return names_split[0] + " " + names_split[1];
        } else {
            return names;
        }
    }

    render() {
        const { ranking_leaders } = this.props;
        const podium_display = ranking_leaders.map( (user, ranking) => {
                    ranking+=1;
                    return this.generatePodium({user, ranking})
        });
        return(
            <div id="leaderboard-podium">
                { podium_display[1] }
                { podium_display[0] }
                { podium_display[2] }
            </div>
        );
    }
}
export default Podium
