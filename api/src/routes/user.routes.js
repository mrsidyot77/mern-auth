import {Router} from "express"
import {loginUser, logoutUser, registerUser, refreshAccessToken, changePassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, google} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-account-details").post(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/google").post(google)

export default router