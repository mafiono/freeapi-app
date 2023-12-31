import { Router } from "express";
import { MAXIMUM_SOCIAL_POST_IMAGE_COUNT } from "../../../constants.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPostById,
  getPostsByTag,
  getPostsByUsername,
  removePostImage,
  updatePost,
} from "../../../controllers/apps/social-media/post.controllers.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  createPostValidator,
  postImagePathVariableValidator,
  postPathVariableValidator,
  tagPathVariableValidator,
  updatePostValidator,
  usernamePathVariableValidator,
} from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/")
  .get(getLoggedInUserOrIgnore, getAllPosts)
  .post(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    createPostValidator(),
    validate,
    createPost
  );

router.route("/get/my").get(verifyJWT, getMyPosts);

router
  .route("/get/u/:username")
  .get(
    getLoggedInUserOrIgnore,
    usernamePathVariableValidator(),
    validate,
    getPostsByUsername
  );

router
  .route("/get/t/:tag")
  .get(
    getLoggedInUserOrIgnore,
    tagPathVariableValidator(),
    validate,
    getPostsByTag
  );

router
  .route("/:postId")
  .get(
    getLoggedInUserOrIgnore,
    postPathVariableValidator(),
    validate,
    getPostById
  )
  .patch(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    postPathVariableValidator(),
    updatePostValidator(),
    validate,
    updatePost
  )
  .delete(verifyJWT, postPathVariableValidator(), validate, deletePost);

router
  .route("/remove/image/:postId/:imageId")
  .patch(
    verifyJWT,
    postPathVariableValidator(),
    postImagePathVariableValidator(),
    validate,
    removePostImage
  );

export default router;
