import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import '../App.css';


class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false
        }
    }

    setRedirect = () => {
        this.setState({
          redirect: true
        })
      }

    renderRedirectToGamePage = () => {
        if (this.state.redirect) {
          return <Redirect to='/game' />
        }
      }

    render() {

        return (
            <div className="text-white mainDiv">
                {this.renderRedirectToGamePage()}
                <h1 className="text-white mt-5 titleTextSize specialFont">Tic Tac Toe</h1>
                <button className="textSize btnCs m-auto p-4 btnTextSize specialFont" onClick={this.setRedirect}>PLAY</button>
            </div>
        )
    }

}

export default HomePage;
