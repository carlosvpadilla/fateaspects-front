import * as React from "react";
import axios from 'axios';
import * as openSocket from 'socket.io-client';
import "./Aspect.css";

export interface AspectProps {
    id: string,
    name: string
}

export interface AspectState {
    toDisplay: string,
    name: string,
    newName: string
}

const displayOptions = {
    showItem: "SHOWITEM",
    editItem: "EDITITEM",
    deleteItem: "DELETEITEM"
};

export interface ServerAspect {
    name: string
}

export class Aspect extends React.Component<AspectProps, AspectState> {
    private socket: SocketIOClient.Socket;

    constructor (props: AspectProps) {
        super(props);
        this.state = {
            toDisplay: displayOptions.showItem,
            name: props.name,
            newName: props.name
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.render = this.render.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.showDelete = this.showDelete.bind(this);
        this.showAspect = this.showAspect.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.registerEvents = this.registerEvents.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.registerEvents();
    }

    registerEvents() {
        this.socket = openSocket('http://localhost:3000');
        
        this.socket.on(`aspect-edit-${this.props.id}`, (aspect: ServerAspect) => {
            this.setState({ name: aspect.name, newName: aspect.name });
        });
    }

    async deleteItem() {
        await axios.delete(
            process.env.SERVER_URL + `/aspects/${this.props.id}`
        );
    }

    async editItem() {
        await axios.patch(
            process.env.SERVER_URL + `/aspects/${this.props.id}`,
            { name: this.state.newName }
        );
        this.showAspect();
    }

    showDelete() {
        this.setState({ toDisplay: displayOptions.deleteItem });
    }

    showAspect() {
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
        return <li className="aspect-card">
            <div className="row">
                <div className="col-8">
                    { this.state.name }
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

    renderConfirmDelete(): React.ReactNode {
        return <li className="aspect-card">
            <div className="row">
                <div className="col-8">
                    <p>¿Deseas borrar este aspecto?</p>
                    <p className="quoted-aspect">
                        { this.state.name }
                    </p>
                </div>
                <div className="col-4">
                    <div className="float-right">
                        <button className="btn btn-primary" onClick={this.deleteItem}>
                            <i className="fas fa-check"></i>
                        </button>
                        <button className="btn btn-danger" onClick={this.showAspect}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </li>;
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ newName: event.target.value });
    }

    renderEdit(): React.ReactNode {
        return <li className="aspect-card">
            <div className="row">
                <div className="col-8">
                    <label>
                        <textarea
                            className="form-control"
                            placeholder="Descripción del Aspecto" 
                            value={this.state.newName} 
                            onChange={this.handleChange} 
                        />
                    </label>
                </div>
                <div className="col-4">
                    <div className="float-right">
                        <button className="btn btn-primary" onClick={this.editItem}>
                            <i className="fas fa-check"></i>
                        </button>
                        <button className="btn btn-danger" onClick={this.showAspect}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </li>;
    }
}