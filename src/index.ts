//define types

type roomsDataType = { 
    name: string; 
    lightIntensity: number; 
    numOfLights: number; 
    isLightOn: boolean; 
    autoOn: string; 
    autoOff: string; 
    usage: number[]; 
    element?: HTMLElement | Element | null; 
    [key: string]: any;
}

// type  wifiConnectionsType = {
//     id: number;
//     wifiName: string;
//     signal: string;
// }


 interface ComponentsData {
    [key:string]: roomsDataType;

}
 interface WifiConnections {
    id: number;
    wifiName:string;
    signal: string;
}


export {ComponentsData , WifiConnections, roomsDataType};