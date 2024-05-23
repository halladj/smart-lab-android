//import * as net from 'net';
import TcpSocket from "react-native-tcp-socket"
import {AppContext} from "../App.provider";

enum MessageType {
    Request,
    Response,
    Command,
    Identify,
    Error,
    Update
}

export interface RequestType{
    messageType: MessageType;
    data: {action: string};
}
export interface ResponseType{
    messageType: MessageType;
    data: {result: string};
}

export class TCPClient {

    private client    : TcpSocket.Socket;
    private host      : string;
    private port      : number;
    private actionName: string;

    private retryInterval = 1000; // Initial retry interval in milliseconds
    private maxInterval = 30000; // Maximum retry interval
    private maxRetries = 3; // Maximum number of reconnection attempts
    private retryCount = 0; // Current retry attempt count

    //result: {value: string | Error};
    setState: any

    constructor(host: string, port: number, actionName:string, setState:any) {
        this.host = host;
        this.port = port;
        this.actionName= actionName;
        this.client = new TcpSocket.Socket();
        this.attachEventListeners();
        this.setState = setState;
        //this.result = result;

    }

    private attachEventListeners() {
        this.client.on('data', (data ) => this.onData(data));
        this.client.on('close', () => this.onClose());
        this.client.on('error', (err: Error) => this.onError(err));
    }

    connect(){
        this.client.connect({port:this.port, host:this.host}, () => {
            console.log('Connected to server');
            this.retryInterval = 1000;
            this.retryCount = 0;

            const message: RequestType= {
                //messageType: MessageType.Request,
                messageType: MessageType.Identify,
                data: {action: this.actionName}
            };

            console.log(message);
            this.sendMessage(message);
        });
    }

    private onData(data: string | Buffer) {
        try {
            const message: ResponseType= JSON.parse(data.toString());
            console.log(message);
            this.processMessage(message);
        } catch (error:any) {
            console.error(`Error parsing incoming data: ${error.message}`);
        }
    }


    private processMessage(message: ResponseType) {
        console.log(`Received message from server: Type - ${MessageType[message.messageType]}, Data - ${message.data}`);
        // Handle different types of messages here
        switch (message.messageType) {
            case MessageType.Response:
                console.log(message);
                console.log(`Response from server: ${message.data.result}`);
                // TODO: clean this up:
                //this.result= {value: message.data.result};
                this.setState({value: message.data.result})
                break;
            case MessageType.Update:
                console.log(`Update from server: ${message.data}`);
                break;
            // Add more cases as needed
        }
    }

    private onClose() {
        if (this.retryCount < this.maxRetries) {
            console.log(`Connection closed. Attempting to reconnect... Attempt ${this.retryCount + 1}/${this.maxRetries}`);
            setTimeout(() => this.connect(), this.retryInterval);
            this.retryInterval = Math.min(this.retryInterval * 2, this.maxInterval);
            this.retryCount++;
        } else {
            console.log('Maximum reconnection attempts reached. Will not reconnect.');
            this.setState({value: new Error("connection timed-out")})
            //this.result= {value: new Error("connection timed-out")};
        }
    }

    private onError(err: Error) {
        console.error(`Connection error: ${err.message}`);
        this.setState({value: err})
        //this.result= {value: err};
    }

    sendMessage(message: RequestType | ResponseType) {
        const serializedMessage = JSON.stringify(message) + '\n';
        this.client.write(serializedMessage);
        console.log(`Sent: ${serializedMessage}`);
    }
}
