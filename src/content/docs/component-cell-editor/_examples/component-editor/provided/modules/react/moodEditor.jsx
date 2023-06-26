import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class MoodEditor extends Component {
    constructor(props) {
        super(props);

        this.onHappyClick = this.onHappyClick.bind(this);
        this.onSadClick = this.onSadClick.bind(this);

        this.state = {
            happy: this.props.value === 'Happy'
        };
    }

    componentDidMount() {
        this.refs.container.addEventListener('keydown', this.checkAndToggleMoodIfLeftRight);
        this.focus();
    }

    componentWillUnmount() {
        this.refs.container.removeEventListener('keydown', this.checkAndToggleMoodIfLeftRight);
    }

    checkAndToggleMoodIfLeftRight = (event) => {
        if (['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1) { // left and right
            this.toggleMood();
            event.stopPropagation();
        }
    };

    componentDidUpdate() {
        this.focus();
    }

    focus() {
        window.setTimeout(() => {
            let container = ReactDOM.findDOMNode(this.refs.container);
            if (container) {
                container.focus();
            }
        }, 10);
    }

    getValue() {
        return this.state.happy ? 'Happy' : 'Sad';
    }

    isPopup() {
        return true;
    }

    setHappy(happy) {
        this.setState({
            happy
        });
    }

    onHappyClick() {
        this.setState({
                happy: true
            },
            () => this.props.api.stopEditing()
        );
    }

    onSadClick() {
        this.setState({
                happy: false
            },
            () => this.props.api.stopEditing()
        );
    }

    toggleMood() {
        this.setHappy(!this.state.happy);
    }

    render() {
        let mood = {
            borderRadius: 15,
            border: '1px solid grey',
            background: '#e6e6e6',
            padding: 15,
            textAlign: 'center',
            display: 'inline-block'
        };

        let unselected = {
            paddingLeft: 10,
            paddingRight: 10,
            border: '1px solid transparent',
            padding: 4
        };

        let selected = {
            paddingLeft: 10,
            paddingRight: 10,
            border: '1px solid lightgreen',
            padding: 4
        };

        let happyStyle = this.state.happy ? selected : unselected;
        let sadStyle = !this.state.happy ? selected : unselected;

        return (
            <div ref="container"
                 style={mood}
                 tabIndex={1} // important - without this the events wont be caught
            >
                <img src="https://www.ag-grid.com/example-assets/smileys/happy.png" onClick={this.onHappyClick} style={happyStyle}/>
                <img src="https://www.ag-grid.com/example-assets/smileys/sad.png" onClick={this.onSadClick} style={sadStyle}/>
            </div>
        );
    }
}
