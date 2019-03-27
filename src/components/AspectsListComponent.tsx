import * as React from "react";
import * as openSocket from 'socket.io-client';
import axios from 'axios';
import { RouteComponentProps } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ServerGame } from "./GameComponent"
import { Aspect } from "./AspectComponent";
import { NewAspect } from "./NewAspectComponent";
import { Redirect } from 'react-router-dom'
import "./AspectsList.css";

export interface AspectsListParams {
    gameid: string
}

export interface AspectsListProps extends RouteComponentProps<AspectsListParams> {}

export interface AspectsListState {
    aspects: Array<ServerAspect>,
    gameId: string,
    gameName: string,
    toggleChange: Boolean,
    shouldRedirect: Boolean
}

export interface ServerAspect {
    _id: string,
    name: string
}

export class AspectsList extends React.Component<AspectsListProps, AspectsListState> {
    private socket: SocketIOClient.Socket;

    constructor(props: AspectsListProps) {
        super(props);
        this.state = {
            aspects: [],
            gameId: this.props.match.params.gameid,
            gameName: "",
            toggleChange: true,
            shouldRedirect: false
        };

        this.render = this.render.bind(this);
        this.createList().catch(() => console.log("Error getting list"));
        this.registerEvents();
    }

    async createList() {
        const data = (await axios.get(`${process.env.SERVER_URL}/games/${this.state.gameId}`)).data;

        this.setState({ 
            gameName: data.name, 
            aspects: data.aspects 
        });
    }

    registerEvents() {
        this.socket = openSocket('http://localhost:3000');

        this.socket.on(`game-edit-${this.state.gameId}`, (editedGame: ServerGame) => {
            this.setState({ gameName: editedGame.name });
        });
        
        this.socket.on(`new-aspect-${this.state.gameId}`, (aspect: ServerAspect) => {
            this.state.aspects.push(aspect);
            this.setState({ toggleChange: !this.state.toggleChange });
        });

        this.socket.on(`delete-aspect-${this.state.gameId}`, (aspect: ServerAspect) => {
            const allIds = this.state.aspects.map((existingAspect: ServerAspect) => existingAspect._id);
            const index = allIds.indexOf(aspect._id);
            this.state.aspects.splice(index, 1);
            this.setState({ toggleChange: !this.state.toggleChange });
        });

        this.socket.on(`delete-game-${this.state.gameId}`, () => {
            this.setState({ shouldRedirect: true });
        });
    }

    render(): React.ReactNode {
        if (this.state.shouldRedirect) {
            return <Redirect to='/' />;
        }

        if (!this.state.aspects.length) {
            return <div>
                <div className="float-right">
                    <button className="btn btn-primary return-button">
                        <NavLink to="/">
                            <i className="fas fa-chevron-left"></i>
                            Regresar
                        </NavLink>
                    </button>
                </div>
                <h2>Lista de Aspectos</h2>
                <h3>Juego: {this.state.gameName}</h3>
                <NewAspect gameId={this.state.gameId} />
            </div>;
        }

        return <div>
            <div className="float-right">
                <button className="btn btn-primary return-button">
                    <NavLink to="/">
                        <i className="fas fa-chevron-left"></i>
                        Regresar
                    </NavLink>
                </button>
            </div>
            <h2>Lista de Aspectos</h2>
            <h3>Juego: {this.state.gameName}</h3>
            <NewAspect gameId={this.state.gameId} />
            <ul className="aspect-list">
                {
                    this.state.aspects.map((element: ServerAspect) => 
                        <Aspect key={ element._id } id={ element._id } name={ element.name } />
                    )
                }
            </ul>
        </div>;
    }
}