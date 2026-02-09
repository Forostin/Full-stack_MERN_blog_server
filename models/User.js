import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true,
        },
        posts: [
            {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Post'      
         }
        ]
    },
    {
        timestamps: true
    }
)

export default mongoose.model('User', UserSchema);