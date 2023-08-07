const New = require('../models/newModel');

const BaseProject = require('../models/baseProjectModel')
const summaryController = {
  getPriceByDistrict: async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$district',
            averagePrice: { $avg: '$price_per_m2' },
          },
        },
      ];

      const result = await New.aggregate(pipeline);
    
      const dataByDistrict = {
        district: [],
        price_per_m2: [],
      };

      result.forEach((item) => {
        dataByDistrict.district.push(item._id);
        dataByDistrict.price_per_m2.push(item.averagePrice);
      });
      console.log(dataByDistrict)
      res.json(dataByDistrict);
    } catch (error) {
      console.error('Error fetching price by district:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  getPriceAvgMonth: async(req, res) => {
      console.log("alo")

      try {
        // Get the current month's average price
        const currentMonth = new Date();
        const oneMonthAgo = new Date();
        const twoMonthAgo = new Date();
        const threeMonthAgo = new Date();

        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        twoMonthAgo.setMonth(twoMonthAgo.getMonth() - 2)
        threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3)

        const currentResults = await New.aggregate([
          {
            $match: {
              price_per_m2: { $exists: true },
              published_at: {
                $gte: oneMonthAgo,
                $lt: currentMonth
              }
            }
          },
          {
            $group: {
              _id: null,
              average_price_per_m2: { $avg: '$price_per_m2' }
            }
          }
        ]);

        console.log(currentResults)
        const currentAveragePrice = currentResults[0].average_price_per_m2;
    
        // Get the average price of the previous month

        const previousResults = await New.aggregate([
          {
            $match: {
              price_per_m2: { $exists: true },
              published_at: {
                $gte: twoMonthAgo,
                $lt: oneMonthAgo
              }
            }
          },
          {
            $group: {
              _id: null,
              average_price_per_m2: { $avg: '$price_per_m2' }
            }
          }
        ]);
        const previousAveragePrice = previousResults[0].average_price_per_m2;
    
        // Get the average price of two months before
    
        const twoMonthsResults = await New.aggregate([
          {
            $match: {
              price_per_m2: { $exists: true },
              published_at: {
                $gte: threeMonthAgo,
                $lt: twoMonthAgo
              }
            }
          },
          {
            $group: {
              _id: null,
              average_price_per_m2: { $avg: '$price_per_m2' }
            }
          }
        ]);
        const twoMonthsAveragePrice = twoMonthsResults[0].average_price_per_m2;
    
        // Calculate the percentage change
        const priceChange = currentAveragePrice - previousAveragePrice;
        const percentageChange = (priceChange / previousAveragePrice) * 100;

        const priceChangeTwoMonth = currentAveragePrice - twoMonthsAveragePrice;
        const percentageChangeTwoMonth = (priceChangeTwoMonth / twoMonthsAveragePrice) * 100;
        console.log(currentAveragePrice)
        res.json(
          {
            'current': currentAveragePrice,
            'changeOneMonthBefore': percentageChange,
            'changeTwoMonth': percentageChangeTwoMonth
          }
        )

      } catch (error) {
      console.error('Error fetching price by month:', error);
        res.status(500).json({ error: 'An error occurred' });
      }  
  },

  getListPrice: async(req, res) => {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const prices = await New.find({ published_at: { $gt: oneMonthAgo } }, {price_per_m2: 1})

      console.log(prices.length)
      prices.sort((a, b) => b.price_per_m2 - a.price_per_m2);
      console.log(prices[prices.length - 1 ])

      const priceBound = Math.ceil(prices.length * 0.05);

      prices.splice(0, priceBound);
      console.log(priceBound)
      const normalizedPrices = prices.map(doc => doc.price_per_m2/1000000);

      normalizedPrices.sort((a, b) => a - b)
      // normalizedPrices = normalizedPrices.map(value => value / 1000000)

      const minValue = Math.floor(normalizedPrices[0]);
      const maxValue = Math.ceil(normalizedPrices[normalizedPrices.length - 1]) + 3
      const binSize = 2
      // const binSize = (maxValue - minValue) / 50;
      const numbins = (maxValue - minValue) / 2

      const bins = Array.from({ length: numbins }, () => ({ range: [], count: 0 }));
      console.log(bins)
      normalizedPrices.forEach((price) => {
        var binIndex = Math.floor((price - minValue) / binSize);
        // console.log(price)
        // console.log(bins[binIndex])
        bins[binIndex].range = [
          minValue + binIndex * binSize,
          minValue + (binIndex + 1) * binSize,
        ];
        bins[binIndex].count++;
      });

      res.json(bins)

    } catch (err) {
      console.error(err);
      res.status(500).json({'error': 'Internal server error'})
    }
  },

  getNumberNewsByDistrict: async(req, res) => {
    try {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const countByDistrict = await New.aggregate([
        {
          $match: {
            published_at: { $gt: oneMonthAgo }
          }
        },
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 }
          }
        }
      ])

      res.json(countByDistrict)
    } catch (err) {
      console.error(err);
      res.status(500).json({'error': 'Internal server error'})
    }
  },

  getPricePerDistrict: async (req, res) => {
    try {

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const result = await New.aggregate(
        [
          {
            $match: {
              published_at: { $gte: oneMonthAgo },
            },
          },
          {
            $group: {
              _id: '$district',
              average_price_per_m2: { $avg: '$price_per_m2' },
              count: { $sum: 1 },
            },
          },
        ]
      )
      res.json(result)

    } catch (error) {
      console.error(error)
      res.status(500).json({error: 'An error occurred'})
    }
  },

  getListProject: async (req, res) => {
    try {
      const results = await BaseProject.find(
        {}, 
        { _id: 0, parser_response: 0}
      ).sort({n_news: -1})
      .limit(20)
      
      res.json(results)
    } catch (error) {
      res.status(500).json({error: 'An error occurred'})
    }
  },

  getListNews: async (req, res) => {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const results = await New.find(
        {published_at: {$gt: oneMonthAgo}}, 
      ).sort({score: -1})
      .limit(20)
      
      res.json(results)
    } catch (error) {
      res.status(500).json({error: 'An error occurred'})
    }
  }
};

  
module.exports = summaryController;
  