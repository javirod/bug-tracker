import express from "express"
import BugsCtrl from "./bugs.controller.js"
import IssuesCtrl from "./issues.controller.js"

const router = express.Router()

router.route("/").get(BugsCtrl.apiGetBugs)

router
    .route("/issue")
    .post(IssueCtrl.apiPostIssue)
    .put(IssueCtrl.apiUpdateIssue)
    .delete(IssueCtrl.apiDeleteIssue)

export default router