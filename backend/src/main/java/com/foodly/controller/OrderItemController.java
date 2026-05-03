package com.foodly.controller;
import com.foodly.model.OrderItem;
import com.foodly.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/orders/{orderId}/items")
public class OrderItemController {
    @Autowired private OrderItemService service;
    @GetMapping public List<OrderItem> getItems(@PathVariable Integer orderId) { return service.getItemsByOrder(orderId); }
    @PostMapping public OrderItem addItem(@PathVariable Integer orderId, @RequestParam Integer foodItemId, @RequestParam Integer quantity) {
        return service.addOrderItem(orderId, foodItemId, quantity);
    }
}
