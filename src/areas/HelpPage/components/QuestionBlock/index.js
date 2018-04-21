import React from 'react';
import './style.css';

class QuestionBlock extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            expanded:false
        };
    }

    componentWillUpdate(){
    }

    render(){
    return(
        <div className="questionblock-container">
            <div onClick={() => this.setState({expanded:this.state.expanded?false:true})} className="__questionblock-question-wrapper">
                <i className="material-icons expand-question">
                  {this.state.expanded?"indeterminate_check_box":"add_box"}
                </i>
                <div className="__questionblock-question-text">{this.props.question}</div>
            </div>
            <div className={`__questionblock-answer-contents ${this.state.expanded?"":"__question-hidden"}`}>
                {this.props.children}
            </div>
        </div>
        
    );
    }
}

export default QuestionBlock;