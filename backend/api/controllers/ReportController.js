const purchase = require('../models/Purchase');
const option = require('../models/Option');
const util = require('../../util/mongoose');
const user = require('../models/User');
const item = require('../models/Item');
var ObjectId = require('mongodb').ObjectId;

class ReportController {
  async overall(req, res, next) {
    var countItem = await item.countDocuments();
    var countPurchase = await purchase.countDocuments();
    var countUser = await user.countDocuments();
    var revenue = 0;

    const overallList = [
      {
        value: countPurchase,
        title: 'Đơn hàng',
      },
      {
        value: countUser,
        title: 'Khách hàng',
      },
      {
        value: countItem,
        title: 'Sản phẩm',
      },
      {
        value: 0,
        title: 'Doanh thu',
      },
    ];

    purchase
      .aggregate([
        {
          $unwind: {
            path: '$list',
          },
        },
        { $match: { status: 'Đã giao hàng' } },
        {
          $lookup: {
            from: 'options',
            let: { option_field: '$list.optionID', color_field: '$list.color' },
            pipeline: [
              {
                $unwind: {
                  path: '$color',
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$option_field'] },
                      { $eq: ['$color.name', '$$color_field'] },
                    ],
                  },
                },
              },
            ],
            as: 'list.option',
          },
        },
        {
          $unwind: {
            path: '$list.option',
          },
        },
        {
          $group: {
            _id: '$_id',
            list: {
              $push: '$list',
            },
          },
        },
        {
          $lookup: {
            from: 'purchases',
            localField: '_id',
            foreignField: '_id',
            as: 'optionDetails',
          },
        },
        {
          $unwind: {
            path: '$optionDetails',
          },
        },
        {
          $addFields: {
            'optionDetails.list': '$list',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$optionDetails',
          },
        },
      ])
      .then((purchase) => {
        for (let result of purchase) {
          for (let item of result.list) {
            revenue +=
              item.option.color.price *
              (1 - item.option.color.discount / 100) *
              item.quantity;
          }
        }
        overallList[3].value += revenue;
        res.json(overallList);
      });
  }

  getSummary(req, res, next) {
    const summary = [
      {
        title: 'Bán hàng',
        subtitle: 'Tổng giá trị bán hàng hôm nay',
        value: 0,
        percent: 0,
      },
      {
        title: 'Sản phẩm',
        subtitle: 'Tổng số sản phẩm đã bán hôm nay',
        value: 0,
        percent: 0,
      },
      {
        title: 'Doanh thu',
        subtitle: 'Doanh thu hôm nay',
        value: 0,
        percent: 0,
      },
      {
        title: 'Lượt mua hàng',
        subtitle: 'Lượt mua hàng hôm nay',
        value: 0,
        percent: 0,
      },
    ];
    var revenueMonth = 0;
    var saleMonth = 0;
    var itemMonth = 0;
    var customerMonth = 0;
    var revenueDay = 0;
    var saleDay = 0;
    var itemDay = 0;
    var customerDay = 0;
    var salePercent = 0;
    var revenuePercent = 0;
    var itemPercent = 0;
    var customerPercent = 0;
    purchase
      .aggregate([
        {
          $unwind: {
            path: '$list',
          },
        },
        {
          $match: {
            $or: [{ status: 'Đang giao hàng' }, { status: 'Đã giao hàng' }],
          },
        },
        {
          $lookup: {
            from: 'options',
            let: { option_field: '$list.optionID', color_field: '$list.color' },
            pipeline: [
              {
                $unwind: {
                  path: '$color',
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$option_field'] },
                      { $eq: ['$color.name', '$$color_field'] },
                    ],
                  },
                },
              },
            ],
            as: 'list.option',
          },
        },
        {
          $unwind: {
            path: '$list.option',
          },
        },
        {
          $group: {
            _id: '$_id',
            list: {
              $push: '$list',
            },
          },
        },
        {
          $lookup: {
            from: 'purchases',
            localField: '_id',
            foreignField: '_id',
            as: 'optionDetails',
          },
        },
        {
          $unwind: {
            path: '$optionDetails',
          },
        },
        {
          $addFields: {
            'optionDetails.list': '$list',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$optionDetails',
          },
        },
      ])
      .then((purchase) => {
        const currentDay = new Date();
        //Tính các chỉ số theo tháng hiện tại để tính phần trăm
        for (let result of purchase) {
          if (
            result.createdAt.getMonth() == currentDay.getMonth() &&
            result.createdAt.getFullYear() == currentDay.getFullYear()
          ) {
            customerMonth++;
            for (let item of result.list) {
              itemMonth += item.quantity;
              saleMonth +=
                item.option.color.price *
                (1 - item.option.color.discount / 100) *
                item.quantity;
            }
          }
          if (
            result.updatedAt.getMonth() == currentDay.getMonth() &&
            result.updatedAt.getFullYear() == currentDay.getFullYear() &&
            result.status == 'Đã giao hàng'
          ) {
            for (let item of result.list) {
              revenueMonth +=
                item.option.color.price *
                (1 - item.option.color.discount / 100) *
                item.quantity;
            }
          }
        }

        //Tính các chỉ số theo ngày hiện tại
        for (let result of purchase) {
          if (
            result.createdAt.getMonth() == currentDay.getMonth() &&
            result.createdAt.getFullYear() == currentDay.getFullYear() &&
            result.createdAt.getDate() == currentDay.getDate()
          ) {
            customerDay++;
            for (let item of result.list) {
              itemDay += item.quantity;
              saleDay +=
                item.option.color.price *
                (1 - item.option.color.discount / 100) *
                item.quantity;
            }
          }
          if (
            result.updatedAt.getMonth() == currentDay.getMonth() &&
            result.createdAt.getFullYear() == currentDay.getFullYear() &&
            result.status == 'Đã giao hàng' &&
            result.updatedAt.getDate() == currentDay.getDate()
          ) {
            for (let item of result.list) {
              revenueDay +=
                item.option.color.price *
                (1 - item.option.color.discount / 100) *
                item.quantity;
            }
          }
        }

        //Tính các chỉ số phần trăm
        salePercent =
          (saleDay / saleMonth) * 100 ? (saleDay / saleMonth) * 100 : 0;
        salePercent = salePercent.toFixed();

        revenuePercent =
          (revenueDay / revenueMonth) * 100
            ? (revenueDay / revenueMonth) * 100
            : 0;
        revenuePercent = revenuePercent.toFixed();

        itemPercent =
          (itemDay / itemMonth) * 100 ? (itemDay / itemMonth) * 100 : 0;
        itemPercent = itemPercent.toFixed();

        customerPercent =
          (customerDay / customerMonth) * 100
            ? (customerDay / customerMonth) * 100
            : 0;
        customerPercent = customerPercent.toFixed();

        console.log(revenuePercent);
        summary[0].value += saleDay;
        summary[0].percent = salePercent;
        summary[1].value += itemDay;
        summary[1].percent = itemPercent;
        summary[2].value += revenueDay;
        summary[2].percent = revenuePercent;
        summary[3].value += customerDay;
        summary[3].percent = customerPercent;

        res.json(summary);
      });
  }

  getDataChart(req, res, next) {
    purchase
      .aggregate([
        {
          $unwind: {
            path: '$list',
          },
        },
        { $match: { status: 'Đã giao hàng' } },
        {
          $lookup: {
            from: 'options',
            let: { option_field: '$list.optionID', color_field: '$list.color' },
            pipeline: [
              {
                $unwind: {
                  path: '$color',
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$option_field'] },
                      { $eq: ['$color.name', '$$color_field'] },
                    ],
                  },
                },
              },
            ],
            as: 'list.option',
          },
        },
        {
          $unwind: {
            path: '$list.option',
          },
        },
        {
          $group: {
            _id: '$_id',
            list: {
              $push: '$list',
            },
          },
        },
        {
          $lookup: {
            from: 'purchases',
            localField: '_id',
            foreignField: '_id',
            as: 'optionDetails',
          },
        },
        {
          $unwind: {
            path: '$optionDetails',
          },
        },
        {
          $addFields: {
            'optionDetails.list': '$list',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$optionDetails',
          },
        },
      ])
      .then((purchase) => {
        const chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var revenueByMonth = 0;
        const currentDay = new Date();
        //Tính các chỉ số theo tháng hiện tại để tính phần trăm (đang thử nghiệm ở tháng 4/2022)
        for (let result of purchase) {
          for (let i = 0; i <= 11; i++) {
            if (
              result.updatedAt.getMonth() == i &&
              result.updatedAt.getFullYear() == currentDay.getFullYear()
            ) {
              for (let item of result.list) {
                revenueByMonth +=
                  item.option.color.price *
                  (1 - item.option.color.discount / 100) *
                  item.quantity;
              }
            }
            chartData[i] += revenueByMonth;
            revenueByMonth = 0;
          }
        }
        res.json(chartData);
      });
  }
}

module.exports = new ReportController();
