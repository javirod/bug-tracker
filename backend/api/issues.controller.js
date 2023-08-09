import IssuesDAO from "../dao/issuesDAO.js"

export default class IssuesController {
    static async apiPostIssue(req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()

            const issueResponse = await IssuesDAO.addIssue(
                restaurantId,
                userInfo,
                review,
                date,
            )

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateIssue(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const issueResponse = await IssuesDAO.updateIssue(
                reviewId,
                req.body.user_id,
                text,
                date,
            )

            var { error } = issueResponse
            if (error) {
                res.status(400).json({ error })
            }

            if (issueResponse.modifiedCount == 0) {
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteIssue(req, res, next) {
        try {
            // Not an ideal form of authentication
            const reviewId = req.query.id
            const userId = req.body.user_id
            console.log(reviewId)
            const issueResponse = await IssuesDAO.deleteIssue(
                reviewId,
                userId,
            )
            res.json({ status: "success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}