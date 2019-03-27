import * as React from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import { GamesList } from "./GamesListComponent";
import { AspectsList } from "./AspectsListComponent";
import './Main.css';

export interface MainProps { }

export class Main extends React.Component {
    constructor (props: MainProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <Router>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8 offset-md-2 header-content">
                        <h1>Aspectos Fate</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 main-content offset-md-2">
                        <Route exact path="/" component={ GamesList } />
                        <Route path="/game/:gameid" component={ AspectsList } />
                    </div>
                </div>
            </div>
        </Router>;
    }
}