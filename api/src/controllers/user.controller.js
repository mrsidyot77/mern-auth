import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken";
import bcrpt from "bcrypt" 

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    // Retrieve the user from the database using their userId
    const user = await User.findById(userId);

    // Generate an access token for the user
    const accessToken = user.generateAccessToken();

    // Generate an refresh token for the user
    const refreshToken = user.generateRefreshToken();

    // Store the generated refresh token in the user's data
    user.refreshToken = refreshToken;

    // Save the user with the new refresh token in the database
    // 'validateBeforeSave: false' skips validation checks before saving
    await user.save({ validateBeforeSave: false });

    // Return both the access token and the refresh token
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);

    throw new ApiError(
      500,
      "Something went wrong while generating Access and refresh Tokens."
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  // get the data from the front end //
  // chek the fields are not empty //
  // check the user if already exist //
  // check for images - avatar is mandatory -coverImage is optional
  //upload on the cloudinary and get the link url to store in db
  //entry in db
  //remove password and refreshTOken for the response
  //send res

  //1.get the data from the frontEnd
  const { fullName, username, email, password } = req.body;

  // //2. check wheather fields are not empty
  if (
    [fullName, username, email, password].some((fields) => {
      // Attempt to trim the field (remove whitespace from both ends)
      // The trim() method does not modify the original string; it returns a new string
      // Here, we're checking if the field exists and has any non-whitespace characters
      return !fields?.trim(); // Return true if the field is empty or undefined
    })
  ) {
    // If any of the fields are empty or consist of only whitespace, throw an error
    throw new ApiError(400, "All fields are required"); // Throw an error with status 400 and a relevant message
  }
  // //3. check if user is exist
  const existUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existUser) {
    throw new ApiError(409, "User already exist.");
  }

  // //4. check for images
  // const avatarLocalPath =  req.files?.avatar[0]?.path;
  // if (!avatarLocalPath) {
  //     throw new ApiError(400, "Avatar file is required")
  // }

  // let coverImageLocalPath;

  // // Check if there are any files in the request and if 'coverImage' is a non-empty array
  // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)  {
  //     // If a cover image is uploaded, store the path of the first file in the array
  //     coverImageLocalPath = req.files.coverImage[0].path;
  // }

  //5. upload on the cloudinary and get the link url
  // const avatar = await uploadOnCloudinary(avatarLocalPath) //clooudinary utils
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  // if (!avatar) {
  //     throw new ApiError(400, "Avatar file is required")
  // }

  //6. entry in db
  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    // coverImage : coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //7. remove password and refreshTOken for the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  //8. send res
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully."));
}); //done

const loginUser = asyncHandler(async (req, res) => {
  //get the data from the frontEnd
  //varify username or email not empty
  //find the user -query
  //varify password//
  //create refreshToken and accessToken
  //store these tokens in secure coockies
  //send the response

  //1. getting data from frontEnd
  const { email, password } = req.body;

  //2. varify username or email not empty
  if (!email) {
    throw new ApiError(401, " email required");
  }

  //3. find the user -mongoose query
  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new ApiError(404, "Email or username does not exist.");
  }

  //4. varify Password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid User's credintials.");
  }

  //5. created refreshToken and accessToken check begging of this doc.

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    // The options object is used to configure the behavior of cookies
    // when they are set or cleared in the user's browser. The options
    // provided below are commonly used to enhance the security of cookies.

    httpOnly: true, // This option makes the cookie inaccessible to JavaScript
    // running in the browser, protecting against XSS attacks.

    secure: true, // This option ensures that the cookie is only sent over
    // secure (HTTPS) connections, protecting it from being
    // intercepted during transmission.
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refershToken"
  );

  //6. sotre these tokens in secure cookies and send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User Logged In Successfully."
      )
    );
}); //done

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out succseefully."));
}); //done

//method to generate a new access and refreshToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = JWT.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request", error);
  }
}); //done

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, conPassword } = req.body;

  if (newPassword !== conPassword) {
    throw new ApiError(400, "New password and Confirm password must be same.");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old Password is invalid.");
  }

  user.password = newPassword; //sets the new password in db

  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been changed successfully."));
}); //done

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully."));
}); //done

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  if (!fullName && !email && !username) {
    throw new ApiError(401, "Email full name or username are required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Account details of the user has been changed successfully."
      )
    );
}); //done

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar file is missing.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(401, "Error while uploading avatar.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated successfully."));
}); //done

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(401, "Avatar file is missing.");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(401, "Error while uploading avatar.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated successfully."));
}); //done

const google = asyncHandler(async (req,res) => {
  try {
    console.log("Google end point hit.");
    
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);
      
      const loggedInUser = await User.findById(user._id).select(
        "-password -refershToken"
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
      
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              refreshToken,
              accessToken,
            },
            "User Logged In Successfully."
          )
        );
    }else{
        const genereatePassword = 
        Math.random().toString(36).slice(-8) + 
        Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrpt.hash(genereatePassword,15)

        const newUser = new User ({
            fullName : req.body.name,
            username:  req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-8),
            
            email : req.body.email,
            password: hashedPassword,
            avatar: req.body.avatar
            //"In this object, the keys are defined in the user.model, while the values are provided by the frontend
        })
        const options = {
          httpOnly: true,
          secure: true,
        };
        
        await newUser.save()
        const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(newUser._id);
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: newUser,
              refreshToken,
              accessToken,
            },
            "User Logged In Successfully."
          )
        );
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in Google login:", error);

    // Throw a custom API error with a status code and message
    throw new ApiError(404, "Something went wrong.");
  }

});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  google,
};
