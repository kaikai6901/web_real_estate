const Feature = require('../models/featureProjectModel')
const BaseProject = require('../models/baseProjectModel')
const New = require('../models/newModel')
const projectController = {
    getAllProjects: async (req, res) => {
      // Logic to fetch and return all project names
      // try {
      //   const pipeline = [
      //     {
      //       $group: {
      //         _id: null,
      //         maxProcessId: { $max: "$process_id" },
      //       },
      //     },
      //     {
      //       $project: {
      //         _id: 0,
      //         maxProcessId: 1,
      //       },
      //     },
      //   ];
      //   const [maxProcessIdResult] = await Feature.aggregate(pipeline);
      //   if (!maxProcessIdResult || !maxProcessIdResult.maxProcessId) {
      //     console.log("No documents found in the collection.");
      //   }
      //   console.log(maxProcessIdResult)
      //   const maxProcessId = maxProcessIdResult.maxProcessId;

      //   // Step 2: Retrieve all the documents that have the greatest process_id
      //   const query = { process_id: maxProcessId };
      //   const documentsWithGreatestProcessId = await Feature.find(query, {_id: 0, name: 1, loc: 1, project_id: 1});
      //   res.json(documentsWithGreatestProcessId)

      try {
        const response = await fetch(`${process.env.MODEL_API_ENDPOINT}/get_all_projects`);
        const data = await response.json();
        res.json(data)
      } catch (error) {
        console.error('Error fetching projects: ', error);
        res.status(500).json({ error: 'An error occurred' });
      }

    },

    getNewsByProject: async (req, res) => {
      try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 31)
        const project_id = parseInt(req.params.project_id);
        console.log(project_id)
        // const project = await BaseProject.findOne({project_id: project_id, published_at: {$gt: oneMonthAgo}});
        // console.log(project)
        // const name = project.name
        const news = await New.find({'base_project.project_id': project_id, last_time_in_page: {$gt: oneMonthAgo}})
        res.json(news)
      } catch (err) {
        console.error('Error fetching projects: ', err);
        res.status(500).json({ error: 'An error occurred' });
      }
    },

    evaluate: async(req, res) => {
      try {
          const project_id = req.query.project_id;
          const square = req.query.square;
          const n_bedrooms = req.query.n_bedrooms;
          console.log(req.query)
          const response = await fetch(`${process.env.MODEL_API_ENDPOINT}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':  'http://127.0.0.1:5555',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
          body: JSON.stringify({
            project_id: project_id,
            square: square,
            n_bedrooms: n_bedrooms
          })
        });
        const data = await response.json();
        res.json(data)
      } catch (err) {
        console.error('Error fetching projects: ', err);
        res.status(500).json({ error: 'An error occurred' });
      }
    
    }
};
  
module.exports = projectController;
  