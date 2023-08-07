const BaseProject = require('../models/baseProjectModel');
const New = require('../models/newModel')
const moment = require('moment');
const newsController = {
    getNearestDocuments: async (req, res) => {
      const longitude = req.query.longitude;
      const latitude = req.query.latitude;
      // Convert longitude and latitude to numbers
      const geocode = [parseFloat(longitude), parseFloat(latitude)];

      const pipelines = []

      const radius_filter = {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: geocode
          },
          "spherical":true,
          "distanceField":"distance",
        }
      }

      if (req.query.radius) {
        radius_filter['$geoNear'].maxDistance = parseInt(req.query.radius)
      } else {
        radius_filter['$geoNear'].maxDistance = 1000
      }

      pipelines.push(radius_filter)

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      console.log(oneMonthAgo)
      const dateFilter = {
        $match: {
          last_time_in_page: { $gt: oneMonthAgo }
        }
      }
      pipelines.push(dateFilter)

      var is_square_filter = false
      const squareFilter = {
        $match: {
          square: {}
        }
      }
      if (req.query.min_square) {
        squareFilter['$match']['square']['$gt'] = parseInt(req.query.min_square)
        is_square_filter = true
      }
      if (req.query.max_square) {
        squareFilter['$match']['square']['$lt'] = parseInt(req.query.max_square)
        is_square_filter = true
      }

      if (is_square_filter) pipelines.push(squareFilter)

      var is_price_filter = false
      const priceFilter = {
        $match: {
          total_price: {}
        }
      }
      if (req.query.min_price) {
        priceFilter['$match']['total_price']['$gt'] = parseInt(req.query.min_price)
        is_price_filter = true
      }

      if (req.query.max_price) {
        priceFilter['$match']['total_price']['$lt'] = parseInt(req.query.max_price)
        is_price_filter = true
      }

      if(is_price_filter) pipelines.push(priceFilter)

      var is_sort = false
      sort_stage = {
        '$sort': {}
      }

      if (req.query.distance) {
        sort_stage['$sort'] = {
          'distance': parseInt(req.query.distance)
        }
        is_sort = true
      }
      if (req.query.total_price) {
        sort_stage['$sort'] = {
          'total_price': parseInt(req.query.total_price)
        }
        is_sort = true
      }
      if (req.query.square) {
        sort_stage['$sort'] = {
          'square': parseInt(req.query.square)
        }
        is_sort = true
      }

      if(is_sort) pipelines.push(sort_stage)
      else pipelines.push({
        '$sort': {
          score: -1
        }
      })
      
      pipelines.push({
        $limit: 30
      })

      try {
        console.log(pipelines)
        const results = await New.aggregate(pipelines)
        console.log(results)
        if (results.length < 10) {
            const threeMonthAgo = new Date();
            threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3)
            pipelines[1].$match.last_time_in_page.$gt = threeMonthAgo
            console.log(pipelines)
            const moreResults = await New.aggregate(pipelines)
            res.json(moreResults)
        } else 
        res.json(results)
      } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal server error'})
      }
    },
    getStatistic: async (req, res) => {
      const longitude = req.query.longitude;
      const latitude = req.query.latitude;
      // Convert longitude and latitude to numbers
      const geocode = [parseFloat(longitude), parseFloat(latitude)];

      const radius_filter = {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: geocode
          },
          "spherical":true,
          "distanceField":"distance",
        }
      }

      if (req.query.radius) {
        radius_filter['$geoNear'].maxDistance = parseInt(req.query.radius)
      } else {
        radius_filter['$geoNear'].maxDistance = 1000
      }

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const currentMonthDateFilter = {
        $match: {
          published_at: { $gt: oneMonthAgo }
        }
      }

      const currentMonth = moment().startOf('month');
      const endMonth = moment().endOf('month')
      const sixMonthsAgo = moment(currentMonth).subtract(6, 'months');

      const historyMonthDateFilter = {
          $match: {
            published_at: {
              $gte: sixMonthsAgo.toDate(),
              $lte: endMonth.toDate()
            }
          }
      }


      var is_square_filter = false
      const squareFilter = {
        $match: {
          square: {}
        }
      }
      if (req.query.min_square) {
        squareFilter['$match']['square']['$gt'] = parseInt(req.query.min_square)
        is_square_filter = true
      }
      if (req.query.max_square) {
        squareFilter['$match']['square']['$lt'] = parseInt(req.query.max_square)
        is_square_filter = true
      }

      var is_price_filter = false
      const priceFilter = {
        $match: {
          total_price: {}
        }
      }
      if (req.query.min_price) {
        priceFilter['$match']['total_price']['$gt'] = parseInt(req.query.min_price)
        is_price_filter = true
      }

      if (req.query.max_price) {
        priceFilter['$match']['total_price']['$lt'] = parseInt(req.query.max_price)
        is_price_filter = true
      }

      const summaryGroupStage = {
        $group: {
          _id: {
              $dateToString: {
                  format: '%Y/%m',
                  date: '$published_at'
                }
          },
          averagePricePerM2: { $avg: '$price_per_m2' },
          count: { $sum: 1 }
        }
      }

      const currentGroupStage = {
        $group: {
          _id: null,
          averageTotalPrice: { $avg: '$total_price' },
          averagePricePerM2: { $avg: '$price_per_m2' },
          minTotalPrice: { $min: '$total_price' },
          minPricePerM2: { $min: '$price_per_m2' },
          maxTotalPrice: { $max: '$total_price' },
          maxPricePerM2: { $max: '$price_per_m2' }
        }
      }

      currentPipelines = [radius_filter, currentMonthDateFilter]
      summaryPipelines = [radius_filter, historyMonthDateFilter]

      if (is_square_filter) {
        currentPipelines.push(squareFilter)
        summaryPipelines.push(squareFilter)
      }

      if (is_price_filter) {
        currentPipelines.push(priceFilter)
        summaryPipelines.push(priceFilter)
      }

      currentPipelines.push(currentGroupStage)
      summaryPipelines.push(summaryGroupStage)
      summaryPipelines.push(
        { $sort: { _id: 1 } }
      )
      try {
        results = {}
        const currentStatistic = await New.aggregate(currentPipelines)
        const historyStatistic = await New.aggregate(summaryPipelines)
        results.currentStatistic = currentStatistic
        results.historyStatistic = historyStatistic
        res.json(results)
      } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal server error'})
      }

    },
    getNearestProjects: async (req, res) => {
      const longitude = req.query.longitude;
      const latitude = req.query.latitude;
      // Convert longitude and latitude to numbers
      const geocode = [parseFloat(longitude), parseFloat(latitude)];

      const pipelines = []

      const radius_filter = {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: geocode
          },
          "spherical":true,
          "distanceField":"distance",
        }
      }

      if (req.query.radius) {
        radius_filter['$geoNear'].maxDistance = parseInt(req.query.radius)
      } else {
        radius_filter['$geoNear'].maxDistance = 1000
      }

      pipelines.push(radius_filter)
        var is_square_filter = false
        const squareFilter = {
          $match: {
            square: {}
          }
        }
        if (req.query.min_square) {
          squareFilter['$match']['max_square']['$gt'] = parseInt(req.query.min_square)
          is_square_filter = true
        }
        if (req.query.max_square) {
          squareFilter['$match']['min_square']['$lt'] = parseInt(req.query.max_square)
          is_square_filter = true
        }
        
        if (is_square_filter) pipelines.push(squareFilter)

        var is_price_filter = false
      const priceFilter = {
        $match: {
          total_price: {}
        }
      }
      if (req.query.min_price) {
        priceFilter['$match']['max_total_price']['$gt'] = parseInt(req.query.min_price)
        is_price_filter = true
      }

      if (req.query.max_price) {
        priceFilter['$match']['min_total_price']['$lt'] = parseInt(req.query.max_price)
        is_price_filter = true
      }

      if(is_price_filter) pipelines.push(priceFilter)

      var is_sort = false
      sort_stage = {
        '$sort': {}

      }

      if (req.query.distance) {
        sort_stage['$sort'] = {
          'distance': parseInt(req.query.distance)
        }
        is_sort = true
      }
      if (req.query.total_price) {
        sort_stage['$sort'] = {
          'avg_total_price': parseInt(req.query.total_price)
        }
        is_sort = true
      }
      if (req.query.square) {
        sort_stage['$sort'] = {
          'avg_square': parseInt(req.query.square)
        }
        is_sort = true
      }

      if(is_sort) pipelines.push(sort_stage)

      // pipelines.push({
      //   $limit: 20
      // })

      try {
        console.log(pipelines)
        const results = await BaseProject.aggregate(pipelines)
        res.json(results)
      } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal server error'})
      }
    },
  };
  
module.exports = newsController;
  