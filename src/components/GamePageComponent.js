import React, { Component } from 'react';
import '../App.css';
import WaitingScreen from '../components/WaitingScreen'
import BoardComponent from '../components/BoardComponent'
var Stomp = require('stompjs');

class GamePage extends Component {
    constructor() {
        super()
        this.name = "";
        this.winner = null;
        this.noWinner = false;
        this.playerDisconnected = false;
        this.gameSessionSubscription = null;
        this.state = {
            connected: false,
            gameSession: null
        }
    }

    createStompClient() {
        if (!this.state.connected) {
            this.stompClient = Stomp.client("wss://tic-tac-toe-be.herokuapp.com/ticTacToe");
            this.connect()
        }
    }

    connect() {
        this.stompClient.debug = true;
        this.stompClient.connect({}, (frame) => {
            this.name = frame.headers.name;
            
            this.stompClient.subscribe("/queue/" + this.name, (data) => {
                this.setGameSessionToState(JSON.parse(data.body))
                if (this.gameSessionSubscription !== null) {
                    this.gameSessionSubscription.unsubscribe()
                    this.subscribeToNewGameSession()
                } else {
                    this.subscribeToNewGameSession()
                }
            });
            
            this.joinGame()
            this.setConnectedState(true)
        });
    }

    subscribeToNewGameSession = () => {
        this.gameSessionSubscription = this.stompClient.subscribe("/topic/" + this.state.gameSession.gameId, (data) => {
            if (JSON.parse(data.body).messageType === "GAMESESSION") {
                let gamesSession = JSON.parse(data.body)
                if (gamesSession.gameState === "ENDED") {
                    if (gamesSession.winner === null) {
                        this.winner = null;
                        this.noWinner = true;
                    } else {
                        this.noWinner = false;
                        this.winner = gamesSession.winner
                    }
                    this.setGameSessionToState(null)
                } else {
                    this.setGameSessionToState(JSON.parse(data.body))
                }
            } else if (JSON.parse(data.body).messageType === "DISCONNECT") {
                this.playerDisconnected = true;
                this.winner = null
                this.noWinner = false
                this.setGameSessionToState(null)
            }
        });
    }

    joinGame = () => {
        this.stompClient.send("/app/join", {}, JSON.stringify({ playerName: this.name }))
    }

    showLoading = () => {
        if (this.state.gameSession == null && this.winner === null && this.noWinner === false && this.playerDisconnected === false) {
            return (
                <WaitingScreen />
            )
        }
    }

    renderBoard = () => {
        if (this.state.gameSession != null) {
            return (
                <BoardComponent name={this.name} whosTurn={this.state.gameSession.whosTurn} gameId={this.state.gameSession.gameId} board={this.state.gameSession.board} sendBoardAction={this.sendBoardAction} />
            )
        }
    }

    sendBoardAction = (action) => {
        this.stompClient.send("/app/act/" + this.state.gameSession.gameId, {}, JSON.stringify(action))
    }

    winnerMessage = () => {
        if (this.winner != null) {
            return (
                <div>
                    <h1 className="text-white mt-5 titleTextSize specialFont">
                        {this.returnWinnerName()}
                    </h1>
                    <br></br>
                    <button className="textSize btnCs m-auto p-4 btnTextSize specialFont" onClick={this.playAgain}>Play Again</button>
                </div>
            )
        }
    }

    noGameWinnerMessage = () => {
        if (this.noWinner) {
            return (
                <div>
                    <h1 className="text-white mt-5 titleTextSize specialFont">
                        No Winner
                </h1>
                    <br></br>
                    <button className="textSize btnCs m-auto p-4 btnTextSize specialFont" onClick={this.playAgain}>Play Again</button>
                </div>
            )
        }
    }

    returnWinnerName = () => {
        if (this.winner === this.name) {
            return "You Win"
        } else {
            return "You Lost"
        }
    }

    showOtherPlayerDisconnectedMessage = () => {
        if (this.playerDisconnected) {
            return (
                <div>
                    <h1 className="text-white mt-5 titleTextSize specialFont">
                        Other player disconnected from game
                </h1>
                    <br></br>
                    <button className="textSize btnCs m-auto p-4 btnTextSize specialFont" onClick={this.playAgain}>Play Again</button>
                </div>
            )
        }
    }

    playAgain = () => {
        this.playerDisconnected = false
        this.winner = null
        this.noWinner = false
        this.setGameSessionToState(null)
        this.joinGame()
    }

    setGameSessionToState = (state) => {
        this.setState({
            gameSession: state
        })
    }

    setConnectedState = (state) => {
        this.setState({
            connected: state
        })
    }
    
    render() {
        return (
            <div className="text-white mainDiv">
                {this.createStompClient()}
                {this.showLoading()}
                {this.renderBoard()}
                {this.winnerMessage()}
                {this.noGameWinnerMessage()}
                {this.showOtherPlayerDisconnectedMessage()}
            </div>
        )
    }

}

export default GamePage;


