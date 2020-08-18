import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    attackShip,
    endGame,
    playerOneAttack,
    playerTwoAttack,
    toggleTurn,
    updateMessage,
    submitTurnOnServer,
    waitTurn,
} from '../_actions';
import { togglePlayer } from '../_helpers/toggle-player';
import Board from '../_components/Board';
import Message from '../_components/Message';
import { Header } from '../MainPage/MainPage'


class GameContainer extends React.Component {
    componentDidMount() {
        const {
            attacks,
            enemyAttacks,
            waitTurn,
            playerToken,
            isPlaying
        } = this.props;
        const enemy_table = document.getElementsByTagName('table')[0];
        const my_table = document.getElementsByTagName('table')[1];
        this.displayHitsAndMisses(attacks, enemy_table);
        this.displayHitsAndMisses(enemyAttacks, my_table);
        console.log("I MOUNTED, isPlaying: ", isPlaying);
        if (!isPlaying) {
            console.log("GOING TO WAIT");
            waitTurn(playerToken);
        }
    }

    componentDidUpdate() {
        const {
            attacks,
            enemyAttacks,
            playerTurn
        } = this.props;

        const enemy_table = document.getElementsByTagName('table')[0];
        const my_table = document.getElementsByTagName('table')[1];
        console.log('Player turn: ', playerTurn);
        this.displayHitsAndMisses(attacks, enemy_table);
        this.displayHitsAndMisses(enemyAttacks, my_table);
    };

    displayHitsAndMisses = (attacks, table) => {
        console.log("Attacks: ", attacks);

        attacks.forEach(attack => {
            let [turn_x, turn_y, hit] = attack;
            let cell = table.rows[turn_x].cells[turn_y];
            console.log("Hit: ", hit);
            switch (hit) {
                case true:
                    cell.classList.add('hit');
                    break;
                case false:
                    cell.classList.add('marker');
                    break;
                case "sunk":
                    cell.classList.add('dead');
                    break;
            }
        });
    };

    buttonClickHandler = (e) => {
        const {
            playerTurn,
            toggleTurn
        } = this.props;

        toggleTurn(togglePlayer(playerTurn));
    };

    clickHandler = (e) => {
        const {
            isPlaying,
            playerToken,
            attacks,
            submitTurnOnServer,
            waitTurn
        } = this.props;

        if (!isPlaying) { return };

        const row = e.target.parentNode.rowIndex;
        const col = e.target.cellIndex;
        const index = attacks.findIndex(obj => obj[0] === row && obj[1] === col);
        if (index !== -1) {
            return;
        }
        submitTurnOnServer(row, col, playerToken, waitTurn);
        return;
    };

    mouseOverHandler = (e) => {
        if (this.props.isPlaying) {
            e.target.classList.toggle('highlight');
        }
    };

    render() {
        const {
            board,
            message,
            playerName,
            isPlaying
        } = this.props;

        return (
            <div className="col-md-7 col-md-offset-2">
                <Header />
                <div className='main'>
                    <div className='game-main'>
                        <h1>{playerName}</h1>
                        {<Message message={message} isPlaying={isPlaying} />}
                        <div className='row'>
                            <div className='column-left_game'>
                                <Board
                                    board={board} z
                                    clickHandler={this.clickHandler}
                                    mouseOverHandler={this.mouseOverHandler}
                                />
                            </div>
                            <div className='column-left_game'>
                                <Board
                                    board={board}
                                    clickHandler={(e) => { }}
                                    mouseOverHandler={(e) => { }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    const playerTurn = state.game.playerTurn;
    const enemy = togglePlayer(playerTurn);
    let user = JSON.parse(localStorage.getItem('user'));

    return {
        attacks: state.game.attacks,
        enemyAttacks: state.game.enemyAttacks,
        board: state.board.board,
        enemyShips: state.board[enemy],
        enemyShipsHealth: state.ships[enemy],
        isPlaying: state.game.isPlaying,
        message: state.game.message,
        playerName: state.game[`${playerTurn}Name`],
        playerTurn,
        playerAttacks: state.game[playerTurn],
        playerToken: user.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        attackShip,
        endGame,
        playerOneAttack,
        playerTwoAttack,
        toggleTurn,
        updateMessage,
        submitTurnOnServer,
        waitTurn
    }, dispatch);
};

const connectedGameContainer = connect(mapStateToProps, mapDispatchToProps)(GameContainer);
export { connectedGameContainer as GameContainer }
