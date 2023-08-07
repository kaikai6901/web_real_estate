const New = require('../models/newModel')
const BaseProject = require('../models/baseProjectModel')
const moment = require('moment');

const modalController = {
    getSummaryByDistrict: async (req, res) => {
        try {
            const district = req.query.district
            console.log(district)
            const currentMonth = moment().startOf('month');
            const endMonth = moment().endOf('month')
            const sixMonthsAgo = moment(currentMonth).subtract(6, 'months');
            const averagePricePerM2 = await New.aggregate([
                {
                  $match: {
                    district: district,
                    published_at: {
                      $gte: sixMonthsAgo.toDate(),
                      $lte: endMonth.toDate()
                    }
                  }
                },
                {
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
                },
                { $sort: { _id: 1 } }
              ]);
            
              const summaryCurrentMonth = await New.aggregate([
                {
                    $match: {
                      district: district,
                      published_at: {
                        $gte: currentMonth.toDate(),
                        $lte: endMonth.toDate()
                      }
                    }
                },
                {
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
              ])

              const data = {
                summary: summaryCurrentMonth,
                history: averagePricePerM2
              }
              res.json(data)
        } catch (err) {
            console.error('Error fetching price by district:', err);
            res.status(500).json({ error: 'An error occurred' });
        }
    },

    getProjectInfor: async (req, res) => {
      try {
        const project_id = parseInt(req.query.project_id)
        const project = await BaseProject.find({project_id: project_id})
        res.json(project)
      } catch (err) {
        console.error('Error fetching price by district:', err);
        res.status(500).json({ error: 'An error occurred' });
      }
    },

    getDetailProject: async (req, res) => {
      try {
        result = {}
        const project_id = req.query.project_id
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const prices = await New.find({ published_at: { $gt: oneMonthAgo }, 'base_project.project_id': project_id}, {price_per_m2: 1})

        const normalizedPrices = prices.map(doc => doc.price_per_m2/1000000);

        normalizedPrices.sort((a, b) => a - b)
        // normalizedPrices = normalizedPrices.map(value => value / 1000000)

        const minValue = Math.floor(normalizedPrices[0]);
        const maxValue = Math.ceil(normalizedPrices[normalizedPrices.length - 1]) + 1
        const binSize = 1
        // const binSize = (maxValue - minValue) / 50;
        const numbins = maxValue - minValue

        const bins = Array.from({ length: numbins }, () => ({ range: [], count: 0 }));
        console.log(bins)
        normalizedPrices.forEach((price) => {
          var binIndex = Math.floor((price - minValue) / binSize);
          bins[binIndex].range = [
            minValue + binIndex * binSize,
            minValue + (binIndex + 1) * binSize,
          ];
          bins[binIndex].count++;
        });

        result.distribute = bins

        console.log(project_id)
        const currentMonth = moment().startOf('month');
        const endMonth = moment().endOf('month')
        const sixMonthsAgo = moment(currentMonth).subtract(6, 'months');
        const averagePricePerM2 = await New.aggregate([
            {
              $match: {
                'base_project.project_id': parseInt(project_id),
                published_at: {
                  $gte: sixMonthsAgo.toDate(),
                  $lte: endMonth.toDate()
                }
              }
            },
            {
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
            },
            { $sort: { _id: 1 } }
          ]);
        console.log(averagePricePerM2)
        result.history = averagePricePerM2

        const project_infor = await BaseProject.find({project_id: project_id}, {loc: 1})
        
        const around_property = await New.aggregate([
          {
            $geoNear: {
              near: project_infor[0].loc,
              "spherical":true,
              "distanceField":"distance",
              'maxDistance': 1000
            }
          }, 
          {
            $match: {
              published_at: { $gt: oneMonthAgo },
              'base_project.project_id': {$ne: project_id}
            }
          },
          {
            $group: {
              _id: null,
              averageTotalPrice: { $avg: '$total_price' },
              averagePricePerM2: { $avg: '$price_per_m2' },
              averageSquare : {$avg: '$square'},
              minTotalPrice: { $min: '$total_price' },
              minPricePerM2: { $min: '$price_per_m2' },
              maxTotalPrice: { $max: '$total_price' },
              maxPricePerM2: { $max: '$price_per_m2' },
              minSquare : {$min: '$square'},
              maxSquare : {$max: '$square'},
              count: {$sum: 1}
            }
          }
          ])
          result.around_property = around_property
          res.json(result)
      } catch (err) {
        console.error('Error fetching price by district:', err);
        res.status(500).json({ error: 'An error occurred' });
      }
    }
}

module.exports = modalController;