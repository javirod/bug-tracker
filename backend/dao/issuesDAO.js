import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let issues

export default class IssuesDAO {
    static async injectDB(conn) {
        if (issues) {
            return
        }
        try {
            issues = await conn.db(process.env.BUGS_NS).collection("reviews")
        } catch (e) {
            console.error('Unable to establish collection handles in userDAO: ' + e)
        }
    }

    static async addIssue(restaurantId, user, review, date) {
        try {
            const issuesDoc = { name: user.name,
                user_id: user_id,
                date: date,
                text: review,
                restaurant_id: new ObjectId(restaurantId), }

            return await issues.insertOne(issuesDoc)
        } catch (e) {
            console.error('Unable to post review:' + e)
            return { error: e }
        }
    }

    static async updateIssue(reviewId, userId, text, date) {
        try {
            const updateResponse = await issues.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId) },
                { $set: { text: text, date: date } },
            )

            return updateResponse
        } catch (e) {
            console.error('Unable to update review: ' + e)
            return { error: e }
        }
    }

    static async deleteIssue(reviewId, userId) {
        try {
            const deleteResponse = await issues.deleteOne({
                _id: new ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error('Unable to delete review: ' + e)
            return { error: e }
        }
    }
}