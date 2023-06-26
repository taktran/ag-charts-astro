import React, {Component, createRef} from 'react';

// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';

export default class MySimpleEditor extends Component {
    constructor(props) {
        super(props);

        this.inputRef = createRef();

        this.state = {
            value: this.getInitialValue(props)
        };
    }

    componentDidMount() {
        setTimeout(() => this.inputRef.current.focus())
    }

    getInitialValue(props) {
        let startValue = props.value;

        const eventKey = props.eventKey;
        const isBackspace = eventKey === KEY_BACKSPACE;

        if (isBackspace) {
            startValue = '';
        } else if (eventKey && eventKey.length === 1) {
            startValue = eventKey;
        }

        if (startValue !== null && startValue !== undefined) {
            return startValue;
        }

        return '';
    }

    getValue() {
        return this.state.value;
    }

    myCustomFunction() {
        return {
            rowIndex: this.props.rowIndex,
            colId: this.props.column.getId()
        };
    }

    render() {
        return (
            <input value={this.state.value} ref={this.inputRef}
                   onChange={event => this.setState({value: event.target.value})}
                   className="my-simple-editor" />
        );
    }
}
