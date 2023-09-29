import { model, Schema } from 'mongoose'


const courseSchema = new Schema({
    title: {
        type: String,
        required:[true,'Title is required'],
        minLength:[8,'Title must be at least 8 character'],
        maxLength:[60,'Title should be less then 60 characters'],
        trim:true
    },
    description: {
        type: String,
        required:[true,'Description is required'],
        minLength:[8,'Description must be at least 8 character'],
        maxLength:[200,'Description should be less then 200 characters'],
        trim:true
    },
    category: {
        type: String,
        required:[true,'category is required'],
        trim:true
    },
    thumbnail: {
        public_id: {
            type: String,
            required:true
        },
        secure_url: {
            type: String,
            required:true
        }
    },
    lectures: [
        {
            type: String,
            description: String,
            lecture: {
                public_id: {
                    type: String
                },
                secure_url: {
                    type: String,
                }
            }
        }
    ],
    numbersOfLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Course = model('Cousre',courseSchema)

export default Course