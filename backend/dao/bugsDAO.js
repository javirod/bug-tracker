import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let bugs

export default class BugsDAO {
    static async injectDB(conn) {
        if (bugs) {
            return
        }
        try {
            bugs = await conn.db(process.env.BUGS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                'Unable to establish a collection handle in restaurantsDAO: ${e}',
            )
        }
    }

    static async getBugs({
        filters = null,
        page = 0,
        bugsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
            query = { $text: { $search: filters["name"] } }
            }
            else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            }
            else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }
        
        let cursor

        try {
            cursor = await bugs
                .find(query)
        } catch (e) {
            console.error('Unable to issue find command, ${e}')
            return { bugsList: [], totalNumBugs: 0 }
        }
        
        const displayCursor = cursor.limit(bugsPerPage).skip(bugsPerPage * page)

        try {
            const bugsList = await displayCursor.toArray()
            const totalNumBugs = await bugs.countDocuments(query)

            return { bugsList, totalNumBugs }
        } catch (e) {
            console.error(
                'Unable to convert cursor to array or problem counting documents, ${e}',
            )
            return { bugsList: [], totalNumBugs: 0 }
        }
    }

    static async getBugById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ]

            return await bugs.aggregate(pipeline).next()
        } catch (e) {
            console.error('Something went wrong in getBugsById ' + e)
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await bugs.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error('Unable to get cuisines, ' + e)
            return cuisines
        }
    }
}
