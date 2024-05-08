const mongoose = require('mongoose');

module.exports = function db_connect() {
try {
mongoose.connect(`mongodb+srv://back:backzada@cluster0.hmxntqd.mongodb.net/lunnarcoins?retryWrites=true&w=majority&appName=Cluster0`)
return { connection_status: "connected" }
} 
catch {
return { connection_status: "disconnected" }
}
}