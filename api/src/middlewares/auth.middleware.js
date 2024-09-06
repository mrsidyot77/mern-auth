import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import JWT from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
     // Get the token from cookies or Authorization header
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

     // If no token is found, throw an unauthorized error
     if (!token) {
         throw new ApiError(401, "Unauthorized request");
     }
 
     // Verify the token using the secret key
     const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
     // Find the user based on the decoded token's user ID, excluding password and refreshToken
     const user = await User.findById(decodedToken._id).select("-password -refreshToken");
 
     // If user doesn't exist, throw an error indicating an invalid token
     if (!user) {
         throw new ApiError(401, "Invalid AccessToken");
     }
 
     // Attach the user to the request object for use in subsequent middleware or routes
     req.user = user;
     next(); // Proceed to the next middleware or route handler
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
   }
});
