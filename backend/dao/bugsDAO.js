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
}
