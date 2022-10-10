const HttpResponse = require("../util/http.util");
const Order = require("../services/order.service");

const submitOrders = async (orders) => {
  try {
    const { result, error } = await Order.saveOrders(orders);
    
    if (error) return HttpResponse.send(HttpResponse.S.BadRequest, error);

    return HttpResponse.send(HttpResponse.S.Success, { message: "Save Pizza Order Successfully", data: result })
    
  } catch (err) {
    return HttpResponse.send(HttpResponse.S.InternalServerError, err.message);
  }

};

const getOrders = async (params) => {
    try {
      const { result, error } = await Order.getOrders(params);
      
      if (error) return HttpResponse.send(HttpResponse.S.BadRequest, error);
  
      return HttpResponse.send(HttpResponse.S.Success, { message: "Retrieve Orders", data: result })
      
    } catch (err) {
      return HttpResponse.send(HttpResponse.S.InternalServerError, err.message);
    }
  
  };

module.exports = {
    submitOrders,
    getOrders
};
