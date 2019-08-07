import React, {Component} from 'react';
import '../App.css';


class WaitingScreen extends Component {
    constructor() {
        super();
        this.state = {
            dotCounter: "."
        }
    }

    render() {
        return (
            <div className="mainDiv">
                <h1 className="m-auto waitingTextSize specialFont">Finding another player {this.state.dotCounter}</h1>
            </div>
        )
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            if (this.state.dotCounter.length > 6) {
                this.setState({
                    dotCounter: "."
                })
            } else {
                this.setState( {
                    dotCounter: this.state.dotCounter+"."
                })
            }
        },1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }
}

export default WaitingScreen;