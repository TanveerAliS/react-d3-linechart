import React, { Component, Fragment } from 'react';
import LineChart from '../components/LineChart';
import { fetchData } from '../utils';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: null
        };
    }

    componentDidMount = () => {
        fetchData().then(response => {
            this.setState({
                data: response.values,
                loading: false,
            });
        });
    };

    render() {
        const { loading, data } = this.state;
        return (
            <Fragment>
                <h1>D3 - Line Chart</h1>
                {loading ? 
                    <div className="loading"><span></span></div>
                    : <LineChart payload={data}/>
                }
            </Fragment>
        );
    }
}

export default App;
