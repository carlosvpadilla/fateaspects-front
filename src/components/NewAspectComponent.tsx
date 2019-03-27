import * as React from "react";
import axios from 'axios';
import './NewAspect.css';

export interface NewAspectProps {
    gameId: string
}

export interface NewAspectState {
    name: string
}

export class NewAspect extends React.Component<NewAspectProps, NewAspectState> {
    constructor (props: NewAspectProps) {
        super(props);
        this.state = { name: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        await axios.post(
            `${process.env.SERVER_URL}/games/${this.props.gameId}/aspect`,
            this.state
        );
        this.setState({name: ''});
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ name: event.target.value });
    }

    render(): React.ReactNode {
        return (
            <form onSubmit={this.handleSubmit} className="new-aspect-form">
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <label htmlFor="newAspectInput">Nuevo Aspecto</label>
                    </div>
                    <div className="col-4">
                        <textarea 
                            id="newAspectInput" 
                            placeholder="Nombre" 
                            className="form-control" 
                            aria-label="Nombre"  
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