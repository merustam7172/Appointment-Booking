import {v2 as cloudinary} from 'cloudinary'

const connetionCloudinary = async () => {
    cloudinary.config({
        cloud_name : process.env.CLOUDINARY_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : CLOUDINARY_SECRET_KEY
    })
}

export default connetionCloudinary