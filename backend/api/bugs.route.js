import express from "express"
import BugsCtrl from "./bugs.controller.js"
import IssuesCtrl from "./issues.controller.js"

const router = express.Router()

router.route("/").get(BugsCtrl.apiGetBugs)

router
    .route("/issue")
    .post(IssuesCtrl.apiPostIssue)
    .put(IssuesCtrl.apiUpdateIssue)
    .delete(IssuesCtrl.apiDeleteIssue)

export default router