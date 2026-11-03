const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type :mongoose.Schema.Types.ObjectId,
        ref : "user",// reference to userMOdel
        required : true
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user",

    },
    status : {
        type : String,
        required : true,
        // enum is like mtlb inke alawa yeh kuxh accept nhi krega in 4 ke alawa
        enum : {
            values :["ignored","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps : true,
});
// make fromuserId and to userId query very fast
connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

connectionRequestSchema.pre("save", async function(){
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cant send connection to yourself")
    }
    
});

const ConnectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;