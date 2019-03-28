import * as React from "react";
import * as openSocket from 'socket.io-client';
import axios from 'axios';
import { Game } from './GameComponent';
import { NewGame } from './NewGameComponent'
import "./GameList.css";

export interface GamesListProps { }

export interface GamesListState {
    games: Array<ServerGame>,
    toggleChange: Boolean
}

export interface ServerGame {
    _id: string,
    name: string
}

export class GamesList extends React.Component<GamesListProps, GamesListState> {
    private socket: SocketIOClient.Socket;

    constructor(props: GamesListProps) {
        super(props);
        this.state = {
            games: [],
            toggleChange: true
        };

        this.createList().catch(() => console.log("Error getting list"));
        this.registerEvents();
    }

    async createList() {
        const data = (await axios.get(process.env.SERVER_URL + '/games')).data;

        this.setState({ games: data });
    }

    registerEvents() {
        this.socket = openSocket(process.env.SERVER_URL);
        
        this.socket.on('new-game', (game: ServerGame) => {
            this.state.games.push(game);
            this.setState({ toggleChange: !this.state.toggleChange });
        });

        this.socket.on('delete-game', (game: ServerGame) => {
            const allIds = this.state.games.map((existingGame: ServerGame) => existingGame._id);
            const index = allIds.indexOf(game._id);
            this.state.games.splice(index, 1);
            this.setState({ toggleChange: !this.state.toggleChange });
        });
    }

    render(): React.ReactNode {
        return <div>
            <h2>Lista de Juegos</h2>
            <ul className="list-group">
                {this.state.games.length > 0 && this.state.games.map((element: any) => 
                        <Game key={ element._id } id={ element._id } name={ element.name } />
                )}
            </ul>
            <NewGame />
        </div>;
    }
}