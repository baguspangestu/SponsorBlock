import * as React from "react";
import * as ReactDOM from "react-dom";
import { ButtonListener } from "../types";

export interface TooltipProps {
    text?: string; 
    link?: string;
    referenceNode: HTMLElement;
    prependElement?: HTMLElement; // Element to append before
    bottomOffset?: string;
    leftOffset?: string;
    rightOffset?: string;
    timeout?: number;
    opacity?: number;
    displayTriangle?: boolean;
    extraClass?: string;
    showLogo?: boolean;
    showGotIt?: boolean;
    buttons?: ButtonListener[];
}

export class Tooltip {
    text?: string;   
    container: HTMLDivElement;

    timer: NodeJS.Timeout;
    
    constructor(props: TooltipProps) {
        props.bottomOffset ??= "70px";
        props.leftOffset ??= "inherit";
        props.rightOffset ??= "inherit";
        props.opacity ??= 0.7;
        props.displayTriangle ??= true;
        props.extraClass ??= "";
        props.showLogo ??= true;
        props.showGotIt ??= true;
        this.text = props.text;

        this.container = document.createElement('div');
        this.container.id = "sponsorTooltip" + props.text;
        this.container.style.position = "relative";

        if (props.prependElement) {
            props.referenceNode.insertBefore(this.container, props.prependElement);
        } else {
            props.referenceNode.appendChild(this.container);
        }

        if (props.timeout) {
            this.timer = setTimeout(() => this.close(), props.timeout * 1000);
        }

        const backgroundColor = `rgba(28, 28, 28, ${props.opacity})`;
        
        ReactDOM.render(
            <div style={{bottom: props.bottomOffset, left: props.leftOffset, right: props.rightOffset, backgroundColor}} 
                className={"sponsorBlockTooltip" + (props.displayTriangle ? " sbTriangle" : "") + ` ${props.extraClass}`}>
                <div>
                    {props.showLogo ? 
                        <img className="sponsorSkipLogo sponsorSkipObject"
                            src={chrome.extension.getURL("icons/IconSponsorBlocker256px.png")}>
                        </img>
                    : null}
                    {this.text ? 
                        <span className="sponsorSkipObject">
                            {this.text + (props.link ? ". " : "")}
                            {props.link ? 
                                <a style={{textDecoration: "underline"}} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={props.link}>
                                    {chrome.i18n.getMessage("LearnMore")}
                                </a> 
                            : null}
                        </span>
                    : null}

                    {this.getButtons(props.buttons)}
                </div>
                {props.showGotIt ?
                    <button className="sponsorSkipObject sponsorSkipNoticeButton"
                        style ={{float: "right" }}
                        onClick={() => this.close()}>

                        {chrome.i18n.getMessage("GotIt")}
                    </button>
                : null}
            </div>,
            this.container
        )
    }

    getButtons(buttons?: ButtonListener[]): JSX.Element[] {
        if (buttons) {
            const result: JSX.Element[] = [];

            for (const button of buttons) {
                result.push(
                    <button className="sponsorSkipObject sponsorSkipNoticeButton sponsorSkipNoticeRightButton"
                            key={button.name}
                            onClick={(e) => button.listener(e)}>

                            {button.name}
                    </button>
                )
            }

            return result;
        } else {
            return null;
        }
    }

    close(): void {
        ReactDOM.unmountComponentAtNode(this.container);
        this.container.remove();

        if (this.timer) clearTimeout(this.timer);
    }
}