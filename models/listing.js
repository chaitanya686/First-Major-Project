const mongoose=require('mongoose');
const Review = require('./review');
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,

    image: {
            url: {
            type:String,
            default: "https://bunny-wp-pullzone-dt0gklpcc4.b-cdn.net/wp-content/uploads/2025/07/Evergreen-Escape-Villa-5bhk-scaled.webp",
            set: (v) => v==="" ? "https://bunny-wp-pullzone-dt0gklpcc4.b-cdn.net/wp-content/uploads/2025/07/Evergreen-Escape-Villa-5bhk-scaled.webp": v, // Set to undefined if empty string
        }
        },


    imageUpload: {
        imagefilename: String,
        imageurl: {
            type:String,
            default: "https://bunny-wp-pullzone-dt0gklpcc4.b-cdn.net/wp-content/uploads/2025/07/Evergreen-Escape-Villa-5bhk-scaled.webp",
            set: (v) => v==="" ? "https://bunny-wp-pullzone-dt0gklpcc4.b-cdn.net/wp-content/uploads/2025/07/Evergreen-Escape-Villa-5bhk-scaled.webp": v, // Set to undefined if empty string
        }
    },
        
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
           
        },
    ],
    owner:
    {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports=Listing;