import BugsDAO from "../dao/bugsDAO.js";

export default class BugsController {
    static async apiGetBugs(req, res, next) {
        const bugsPerPage = req.query.bugsPerPage ? parseInt(req.query.bugsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.cuisine)  {
            filters.cuisine = req.query.cuisine
        }
        else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        }
        else if (req.query.name) {
            filters.name = req.query.name
        }

        const { bugsList, totalNumBugs} = await BugsDAO.getBugs({
            filters,
            page,
            bugsPerPage,
        })

        let response = {
            bugs: bugsList,
            page: page,
            filters: filters,
            entries_per_page: bugsPerPage,
            total_results: totalNumBugs
        }
        res.json(response)
    }

    static async apiGetBugById(req, res, next) {
        try {
            let id = req.params.id || {}
            let restaurant = await BugsDAO.getBugById(id)
            if (!restaurant) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(restaurant)
        } catch (e) {
            console.log('api, ' + e)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetBugCuisines(req, res, next) {
        try {
            let cuisines = await BugsDAO.getCuisines()

            res.json(cuisines)
        } catch (e) {
            console.log('api, ' + e)
            res.status(500).json({ error: e })
        }
    }
}