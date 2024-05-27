export type RootStackParamsList = {
  Home: undefined,
  QrScanner:undefined,
  Page3: undefined,
  Collaboration:{ 
    actionName:string,
    host      : string,
  }, 
  Authentication: undefined,
  Main : {screen:string}
}



export type ServiceDescriptor = {
  type    : 'http' | 'smtp', 
  protocol: 'tcp' | 'udp',
  domain  : string,
  name    : string,
  port    : number,
  txt     : { Agent_identifier: string}
}


//const type = 'http'; // Service type
  //const protocol = 'tcp'; // Protocol
  //const domain = 'local.'; // Domain
  //const name = 'Courses'; // Name of the service
  //const port = 8002; // Port on which your service is running
  //const txt = { // TXT record with additional information
    //txtvers: '1', // Version of the TXT record format
    //Agent_identifier: 'My Sample Service',
  //};


