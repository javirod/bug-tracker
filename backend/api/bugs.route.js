import express from "express"
import BugsCtrl from "./bugs.controller.js"
import IssuesCtrl from "./issues.controller.js"

const router = express.Router()

router.route("/").get(BugsCtrl.apiGetBugs)
router.route("/id/:id").get(BugsCtrl.apiGetBugById)
router.route("/cuisines").get(BugsCtrl.apiGetBugCuisines)

router
    .route("/issue")
    .post(IssuesCtrl.apiPostIssue)
    .put(IssuesCtrl.apiUpdateIssue)
    .delete(IssuesCtrl.apiDeleteIssue)

export default router