import * as React from "react";
import axios from 'axios';
import * as openSocket from 'socket.io-client';
import { NavLink } from "react-router-dom";
import "./Game.css";

export interface GameProps {
    id: string,
    name: string
}

export interface GameState {
    toDisplay: string,
    name: string,
    newName: string,
    isHovering: boolean
}

const displayOptions = {
    showItem: "SHOWITEM",
    editItem: "EDITITEM",
    deleteItem: "DELETEITEM"
};

export interface ServerGame {
    name: string
}

export class Game extends React.Component<GameProps, GameState> {
    private socket: SocketIOClient.Socket;

    constructor (props: GameProps) {
        super(props);
        this.state = {
            toDisplay: displayOptions.showItem,
            name: props.name,
            newName: props.name,
            isHovering: false
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.render = this.render.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.showDelete = this.showDelete.bind(this);
        this.showGame = this.showGame.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.registerEvents = this.registerEvents.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addActive = this.addActive.bind(this);
        this.removeActive = this.removeActive.bind(this);

        this.registerEvents();
    }

    registerEvents() {
        this.socket = openSocket(process.env.SERVER_URL);
        
        this.socket.on(`game-edit-${this.props.id}`, (game: ServerGame) => {
            this.setState({ name: game.name, newName: game.name });
        });
    }

    async deleteItem() {
        await axios.delete(
            process.env.SERVER_URL + `/games/${this.props.id}`
        );
    }

    async editItem() {
        await axios.patch(
            process.env.SERVER_URL + `/games/${this.props.id}`,
            { name: this.state.newName }
        );
        this.showGame();
    }

    showDelete() {
        this.setState({ toDisplay: displayOptions.deleteItem });
    }

    showGame() {
        this.setState({ toDisplay: displayOptions.showItem });
    }

    showEdit() {
        this.setState({ toDisplay: displayOptions.editItem });
    }

    render(): React.ReactNode {
        switch (this.state.toDisplay) {
            case displayOptions.showItem:
                return this.renderShow();
            case displayOptions.deleteItem:
                return this.renderConfirmDelete();
            case displayOptions.editItem:
                return this.renderEdit();
        }
    }

    renderShow(): React.ReactNode {
        return <li className={this.elementClasses} onMouseOver={this.addActive} onMouseLeave={this.removeActive}>
            <div className="row">
                <div className="col-8">
                    <NavLink to={`/game/${this.props.id}`}>{ this.state.name }</NavLink>
                </div>
                <div className="col-4">
                    <div className="float-right">
                        <button className="btn btn-primary" onClick={this.showEdit}>
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-danger" onClick={this.showDelete}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </li>;
    }

    get elementClasses() {
        let classes = "game list-group-item";
        if (this.state.isHovering) {
            classes += " active";
        }
        return classes;
    }

    renderConfirmDelete(): React.ReactNode {
        return <li className={this.elementClasses} onMouseOver={this.addActive} onMouseLeave={this.removeActive}>
            <div className="row">
                <div className="col-8">
                    ¿Deseas borrar el juego "{ this.state.name }"?
                </div>
                <div className="col-4">
                    <div className="float-right">
                        <button className="btn btn-primary" onClick={this.deleteItem}>
                            <i className="fas fa-check"></i>
                        </button>
                        <button className="btn btn-danger" onClick={this.showGame}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </li>;
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ newName: event.target.value });
    }

    addActive(event: React.MouseEvent) {
        this.setState({isHovering: true});
    }

    removeActive(event: React.MouseEvent) {
        this.setState({isHovering: false});
    }

    renderEdit(): React.ReactNode {
        return <li className={this.elementClasses} onMouseOver={this.addActive} onMouseLeave={this.removeActive}>
            <div className="row">
                <div className="col-8">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id={`name-label-${this.props.id}`}>Nombre</span>
                        </div>
                        <input type="text" className="form-control" aria-describedby={`name-label-${this.props.id}`} value={this.state.newName} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="col-4">
                    <div className="float-right">
                        <button className="btn btn-primary" onClick={this.editItem}>
                            <i className="fas fa-check"></i>
                        </button>
                        <button className="btn btn-danger" onClick={this.showGame}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>                
                </div>
            </div>
        </li>;
    }
}