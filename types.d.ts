import { Connection } from "mongoose"

//declaring global type
declare global {
    var mongoose: {
        conn: Connection | null //Either there is connection or null
        promise: Promise<Connection> | null //Either it is connecting (returns a promise) or null. While the app is running there may be various promises so we have to mention that it is a promise of type Connection
    }

}

export { } //Exported an objectto make it available in the global scope. This is a common pattern in TypeScript.