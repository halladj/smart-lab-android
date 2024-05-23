// Define the State enum as per the struct definition
export enum State {
    Normal = "normal",
    Collaborated = "collaborated",
    Degraded = "degraded",
    Broken = "broken"
}

export enum ActionState{
  Succ = "succ",
  Fail = "fail"
}

export class Action {
  name : string;
  SCA  : Set<string>;
  state: ActionState;

  constructor(name:string){
    this.name = name;
    this.SCA  = new Set<string>();
    this.state= ActionState.Succ;
  }

  addToSCA ( agentName:string ): boolean{
    if (this.SCA.has(agentName)){
      this.SCA.add(agentName)
      return true;
    }
    return false;
  }

  removeFromSCA( agentName: string ) : boolean{
    return this.SCA.delete(agentName);
  }
}
// Define the Agent class
export class Agent {
    Ag: string;           // Agent Identifier

    //SDA: Set<Action>;     // Set of available Actions
    //SCA: Set<Agent>;     // Set of Contextual Agents
    //// a.SCA implemented in the Action class
    //SFA: Set<Agent>;     // Set of Failed Agents
    SDA: Action[];
    SCA: Agent[];
    SFA: Agent[];

    State    : State;     // State of the agent
    LastState: State | null;     // State of the agent

    R: string | null; // containing the result of the request.
    // a.State is implemented in the Action class.
    Signature    : string | null;    // A string var init by null.
    LastSignature: string | null;// A string var init by null.

    Timeout: number;

    DiagnosticState: boolean;

    // Main Constructore
    constructor(
      ag   : string,
    )
    constructor(
        ag: string,
    ) {
        this.Ag = ag;

        //this.SDA = new Set<Action>();
        //this.SCA = new Set<Agent>();
        //this.SFA = new Set<Agent>();
        this.SDA = [];
        this.SCA = [];
        this.SFA = [];

        this.R   = null;

        this.State     = State.Normal;
        this.LastState = null;

        this.Signature     = null;
        this.LastSignature = null;

        this.Timeout         = 0;
        this.DiagnosticState = true;
    }

    // utility function.

    handleResolve ( actionName:string, agentName:string ){
      if ( !this.addToSCA(agentName, actionName) ){

      }

    }
    
    // for now its the host.
    addToSCA( agentName: string, actionName:string ):boolean {
      // TODO make it check for the exixtance of the actionName
      // inside the SDA to remove the reducncecy.
      for (var a of this.SCA){
        if ( a.Ag === agentName ){
          //console.log( "a.Ag ===" + a.Ag+ "   agentName===" +agentName )
          const temp = this.SDA.filter( (action: Action) => action.name === actionName ? true : false);
          //console.log("now filter results" + temp)
          if ( temp.length === 1 ){
            temp[0].SCA.add(agentName);
          }else if( temp.length === 0 ){
            const tempAction = new Action(actionName);
            tempAction.SCA.add(agentName);
            this.SDA.push(tempAction);
          }
          return false;
        }
      }
      const newAg = new Agent(agentName);
      // make sure this is a new Action ( not in SDA ).
      const temp = this.SDA.filter( (action: Action) => action.name === actionName ? true : false );

      if ( temp.length === 1 ){
        temp[0].SCA.add(agentName);
        newAg.SDA.push(temp[0]);
      }else if( temp.length === 0 ){
        const newAction= new Action(actionName)
        newAction.SCA.add(newAg.Ag)
        newAg.SDA.push(newAction);
      }
      this.SCA.push(newAg)
      return true;
    }


    getAvailableActions(): Action[]{
      let temp:Set<Action> = new Set<Action>([...this.SDA])

      if ( this.SCA.length !== 0 ){
        for( var a of this.SCA.values()) {
          temp = new Set<Action>([...temp, ...a.SDA])
        }
      }
      
      return Array.from(temp)
    }

    getAvailableActionsDictionary(): { [agent: string]: Action[] }{

      let result: { [agent: string]: Set<Action> } = {}
      let arrayResult: { [agent: string]: Action[] } = {}

      let temp:Set<Action> = new Set<Action>([...this.SDA])
      result[this.Ag]= temp; 
      //console.log("Outside======")
      //console.log(temp.keys())

      temp=new Set<Action>()
      if ( this.SCA.length !== 0 ){
        for( var a of this.SCA.values()) {
          temp = new Set<Action>([...temp, ...a.SDA])
          result[a.Ag]= temp; 
          //console.log("inside ======= "+temp.keys())
          //console.log(temp.keys())
        }
      }

      for (var i of Object.keys(result)){
        let x = result[i]
        arrayResult[i] = Array.from(x)
      }
      return arrayResult
    }



    // the getF() function in the protocol.
    getSFA() : Agent | undefined{
      //if (this.SFA.size === 0){
        //return null;
      //}

      //const itr: IterableIterator<Agent> = this.SFA.values()
      //const [elemnt, _] = itr;
      //if ( this.SFA.delete(elemnt) ){

      //return elemnt;
      //}
      //return null;
      return this.SFA.shift();
    }

    // getS() is provided by the runtime.
    // select() is used to get a shadow agent.
    getShadowAgent(){
      //TODO
    }

    LogicCalc(s1:State, last:State | null):State{
      return State.Normal;
    }

    getActionProvider(action: Action): Agent | null{
      //for (var agent of this.SCA){
        //if( agent.SDA.has(a) ){
          //return agent;
        //}
      //}
      //return null;
      for( var ag of this.SCA ){
        if( ag.hasAction(action.name) ){
          return ag;
        }
      }
      return null;
    }

    /*
     *
     * Protocol functions.
     *
     *
     */



    /*
     * e4
     */
    SendRequest(a: Action, Ag:string){
      this.State = State.Collaborated;
      this.LastState = this.State;
      this.SDA.push(a);
      //this.SDA.add(a);
      // TODO send it code << Most be called on the client side>>.
    }

    /*
     * e5
     */
    OnReceiveRequest(a: Action, Ag:string){
      //if ( this.SDA.has(a) ){
        // tODO Do the action.
        //this.R = "THE_RESUALT";
        // tODO send the result.
      //}
      if ( this.hasAction( a.name ) ){
        // TODO Do the action.
        this.R = "THE_RESUALT";
        // TODO send the result.
      }
      // TODO send it code << Most be called on the Server side>>.
    }


    /*
     * e6
     */
    OnReceiveResult(a:Action, result:string, Ag:string){
      if ( result !== null ){
        if( this.hasAction(a.name) ){
          this.SDA.filter((dAction:Action) => { 
            if ( dAction.name === a.name ){
              return false;
            }
            return true;
          });
        }
        a.state = ActionState.Succ;
      }else{
        a.state= ActionState.Fail;
      }
    }

    /*
     * e7
     */
    ChooseAgentForAction(a:Action ){

      let Ag = this.getActionProvider(a);
      if(Ag !== null){

        // TODO Handle this in the zeroconf part.
        this.SendRequest(a, Ag.Ag);

        // TODO imppement a Wait();
        // wait ( a.State === fail || Timeout is reached ).
        // handling not receiving a response.
        if (this.hasAction(a.name)){
          this.State = this.LogicCalc(State.Degraded, this.LastState);
          this.SCA.filter( (agent:Agent) => {
            if(agent.Ag === Ag?.Ag){
              return false;
            }
            return true;
          });
          //this.SCA.delete(Ag);
          this.SFA.push(Ag)
          //this.SFA.add(Ag);
          this.ChooseAgentForAction(a);
        }

      }else{
          this.State = this.LogicCalc(State.Degraded, this.LastState);
          a.state = ActionState.Fail;
          if ( this.SFA.length == 0 ){
            // do e11 shadowAgent.
          }else {
            const temp = this.getSFA();
            if ( temp !== undefined ){
              Ag = temp;
            }
            // do e11 shadowAgent.
          }

      }
    }

  hasAction = (actionName: string) : boolean =>{
    for (var a of this.SDA){
      if ( a.name === actionName){
        return true;
      }
    }
    return false;
  }
}

