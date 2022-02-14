import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload, deleteVideo, getDetail, postDetail, record} from "../controllers/videoController";
import { pathOnlyMiddleware, protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.single("video"), postUpload);
videoRouter.route("/upload/details").all(pathOnlyMiddleware).get(getDetail).post(videoUpload.single("thumb"),postDetail);
videoRouter.get("/record", protectorMiddleware, record);

export default videoRouter;