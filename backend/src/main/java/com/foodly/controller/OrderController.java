package com.foodly.controller;

import com.foodly.model.Order;
import com.foodly.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService service;

    @GetMapping
    public List<Order> getAll() { return service.getAllOrders(); }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Integer id) { return service.getOrderById(id); }

    @GetMapping("/customer/{customerId}")
    public List<Order> getByCustomer(@PathVariable Integer customerId) {
        return service.getOrdersByCustomer(customerId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Order> getByRestaurant(@PathVariable Integer restaurantId) {
        return service.getOrdersByRestaurant(restaurantId);
    }

    @PostMapping("/place")
    public Order placeOrder(@RequestParam Integer customerId,
                            @RequestParam Integer restaurantId,
                            @RequestBody Order order) {
        return service.placeOrder(customerId, restaurantId, order);
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.get("status"));
    }

    @PutMapping("/{id}/accept")
    public Order accept(@PathVariable Integer id) { return service.acceptOrder(id); }

    @PutMapping("/{id}/reject")
    public Order reject(@PathVariable Integer id) { return service.rejectOrder(id); }

    @PutMapping("/{id}/assign/{partnerId}")
    public Order assign(@PathVariable Integer id, @PathVariable Integer partnerId) {
        return service.assignDeliveryPartner(id, partnerId);
    }
}
