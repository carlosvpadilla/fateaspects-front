import * as React from "react";
import * as openSocket from 'socket.io-client';
import axios from 'axios';
import "./NewGame.css";

export interface NewGameProps { }

export interface NewGameState {
    name: string
}

export class NewGame extends React.Component<NewGameProps, NewGameState> {
    constructor (props: NewGameProps) {
        super(props);
        this.state = { name: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        await axios.post(
            process.env.SERVER_URL + '/games',
            this.state
        );
        this.setState({name: ''});
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ name: event.target.value });
    }

    render(): React.ReactNode {
        return (
            <form onSubmit={this.handleSubmit} className="new-game-form">
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <label htmlFor="newGameInput">Nuevo Juego</label>
                    </div>
                    <div className="col-4">
                        <input 
                            id="newGameInput" 
                            placeholder="Nombre" 
                            className="form-control" 
                            aria-label="Nombre" 
                            type="text" 
                            value={this.state.name} 
                            onChange={this.handleChange} 
                        />
                    </div>
                    <div className="col-auto">
                        <input className="btn btn-primary" type="submit" value="Crear" />
                    </div>
                </div>
            </form>
        );
    }
}