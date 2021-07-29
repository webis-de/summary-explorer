import React from "react";
import CopyIcon from "./icons/CopyIcon";
import UrlCopiedMessage from "./UrlCopiedMessage";

class ShareButton extends React.Component{
    constructor() {
        super();
        this.state = {
            showCopiedMessage: false
        }
    }
    setShowCopiedMessage = (val)=>{
        this.setState({
            showCopiedMessage: val
        })
    }

    shareButtonClicked = ()=>{
        this.props.copyTextToClipboard();
        this.setShowCopiedMessage(true)
        // After 3 seconds set the showCopiedMessage value to false
        setTimeout(() => {this.setShowCopiedMessage(false)}, 3000);
    }

    render() {
        return (
            <div className="float-right ">
                {this.state.showCopiedMessage? <UrlCopiedMessage /> :null}
                <button className="px-1 py-1 bg-blue-800 text-white text-xs rounded mr-1
                hover:bg-red-700 cursor-pointer mr-1 focus:outline-none"
                        onClick={() => {this.shareButtonClicked()}}>
                    <span className="mx-1">Share View</span>
                    <CopyIcon/>
                </button>
            </div>
        )
    }
}

export default ShareButton;


