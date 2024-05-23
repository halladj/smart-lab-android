import TcpSocket from "react-native-tcp-socket"
import AsyncStorage from '@react-native-async-storage/async-storage';

enum MessageType {
    Request,
    Response,
    Command,
    Identify,
    Error,
    Update
}


interface RequestType{
    messageType: MessageType;
    data: { action:string };
}

interface ResponseType{
    messageType: MessageType;
    data: { result:string };
}

export class TCPServer {
    private server: TcpSocket.Server;
    private port: number;
    private host: string;

    constructor(port: number, host: string) {
        this.port = port;
        this.host = host;
        this.server = TcpSocket.createServer((sock: TcpSocket.Socket) => this.onConnection(sock));
        this.server.on('error', (err) => this.onError(err));
    }

    start() {
        this.server.listen({port:this.port, host:this.host}, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    private onConnection(sock: TcpSocket.Socket) {
        console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
        let buffer = '';

        sock.on('data', (data: string | Buffer) => {
            buffer += data.toString();
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                const message = buffer.substring(0, boundary);
                buffer = buffer.substring(boundary + 1);
                this.processMessage(message, sock);
                boundary = buffer.indexOf('\n');
            }
        });

        sock.on('close', () => {
            console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
        });

        sock.on('error', (err: Error) => {
            console.error(`ERROR from ${sock.remoteAddress}: ${err.message}`);
        });
    }

    private async processMessage(message: string, sock: TcpSocket.Socket) {
        try {
            const parsedMessage: RequestType= JSON.parse(message);
            console.log(`Received message type: ${MessageType[parsedMessage.messageType]}, data: ${parsedMessage.data}`);
            switch (parsedMessage.messageType) {
                case MessageType.Request:
                    this.sendMessage({ messageType: MessageType.Response, data: {result:"3.14455"} }, sock);
                    break;
                case MessageType.Identify:
                    console.log("im inside this");
                    const data=await AsyncStorage.getItem("Identifier");
                    if (data != null){
                      this.sendMessage({ 
                        messageType: MessageType.Response, data: {result:data} }, sock);
                    }else {
                      this.sendMessage({ 
                        messageType: MessageType.Response, data: {result:"error"} }, sock);

                    }

            }
        } catch (error:any) {
            console.error(`Error parsing message: ${error.message}`);
        }
    }

    private sendMessage(message: ResponseType, socket: TcpSocket.Socket) {
        const serializedMessage = JSON.stringify(message) + '\n';
        socket.write(serializedMessage);
    }

    private onError(err: Error) {
        console.error(`Server error: ${err.message}`);
        console.error(err);
    }
}


