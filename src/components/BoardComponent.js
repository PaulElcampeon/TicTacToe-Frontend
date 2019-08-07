import React, { Component } from 'react';
import '../App.css';


const blockPos = (xPos, yPos) => {
    return { x: xPos, y: yPos }
}

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        }
    }

    renderCorrectSign(sign) {
        if (sign === "EMPTY") {
            return ""
        } else if (sign === "NOUGHT") {
            return "O"
        } else {
            return "X"
        }
    }

    renderBoard = () => {
        if (this.mounted) {
            this.sortOutBoardSize()
            this.canvas.removeEventListener('click', this.clicky)
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.props.board.blocks.forEach((block, index) => {
                this.ctx.beginPath();
                this.ctx.lineWidth = "6";
                this.ctx.strokeStyle = "white";
                this.ctx.rect(this.blockPositions[index].x, this.blockPositions[index].y, this.blockWidth, this.blockHeight)
                this.ctx.fillStyle = "red";
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.font = "30px Comic Sans MS";
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.renderCorrectSign(block.blockState), (this.blockPositions[index].x + this.blockWidth / 2), (this.blockPositions[index].y + this.blockHeight / 2));
            });

            this.canvas.addEventListener('click', this.clicky)

        }
    }

    clicky = (e) => {
        this.props.board.blocks.forEach((block, index) => {
            if (e.offsetY > this.blockPositions[index].y && e.offsetY < this.blockPositions[index].y + this.blockHeight
                && e.offsetX > this.blockPositions[index].x && e.offsetX < this.blockPositions[index].x + this.blockWidth
                && block.blockState === "EMPTY" && this.props.whosTurn === this.props.name) {
                this.props.sendBoardAction({ playerName: this.props.name, gameId: this.props.gameId, blockNo: index })
            }
        })
    }

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.ctx = this.canvas.getContext("2d")
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.mounted = true
        this.renderBoard()
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }

    handleResize = () => this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    });

    sortOutBoardSize = () => {        
        this.canvas.width = this.getSmallestSize() - 50;
        this.canvas.height = this.getSmallestSize() - 50;

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.blockWidth = this.canvasWidth / 3;
        this.blockHeight = this.canvasHeight / 3;
        this.blockPositions = [];

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                this.blockPositions.push(blockPos(this.blockWidth * x, this.blockHeight * y))
            }
        }
    }

    getSmallestSize = () => {
        let size = this.state.windowHeight < this.state.windowWidth? this.state.windowHeight : this.state.windowWidth
        return size > 630? 550 : size
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }


    getWhosTurn = () => {
        return this.props.whosTurn === this.props.name ? "Your Turn" : "Opponents Turn"
    }

    gameInformation = () => {
        return (
            <h1 className="text-white text-center mb-5 pb-5 titleTextSize specialFont">
                {this.getWhosTurn()}
            </h1>
        )
    }

    render() {
        return (
            <div className="m-auto">
                {this.gameInformation()}
                <canvas ref="canvas" width={500} height={500} />
                {this.renderBoard()}
            </div>
        )
    }

}

export default BoardComponent;