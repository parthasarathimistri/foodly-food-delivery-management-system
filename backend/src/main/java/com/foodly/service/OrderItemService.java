package com.foodly.service;
import com.foodly.model.OrderItem;
import com.foodly.model.Order;
import com.foodly.model.FoodItem;
import com.foodly.repository.OrderItemRepository;
import com.foodly.repository.OrderRepository;
import com.foodly.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class OrderItemService {
    @Autowired private OrderItemRepository repository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    public List<OrderItem> getItemsByOrder(Integer orderId) { return repository.findByOrderOrderId(orderId); }
    public OrderItem addOrderItem(Integer orderId, Integer foodItemId, Integer quantity) {
        Order o = orderRepository.findById(orderId).orElseThrow();
        FoodItem f = foodItemRepository.findById(foodItemId).orElseThrow();
        OrderItem item = new OrderItem(o, f, quantity);
        return repository.save(item);
    }
}
