package com.foodly.controller;

import com.foodly.model.Order;
import com.foodly.model.DeliveryPartner;
import com.foodly.repository.CustomerRepository;
import com.foodly.repository.RestaurantRepository;
import com.foodly.repository.OrderRepository;
import com.foodly.repository.PaymentRepository;
import com.foodly.service.OrderService;
import com.foodly.service.DeliveryPartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private CustomerRepository customerRepo;
    @Autowired private RestaurantRepository restaurantRepo;
    @Autowired private OrderRepository orderRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private OrderService orderService;
    @Autowired private DeliveryPartnerService deliveryService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", customerRepo.count());
        stats.put("totalRestaurants", restaurantRepo.count());
        stats.put("totalOrders", orderRepo.count());
        stats.put("totalRevenue", paymentRepo.findAll().stream()
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0).sum());
        stats.put("pendingOrders", orderRepo.findByStatus("PLACED").size());
        stats.put("activeDeliveries", orderRepo.findByStatus("PICKED_UP").size());
        stats.put("deliveredOrders", orderRepo.findByStatus("DELIVERED").size());
        return stats;
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() { return orderService.getAllOrders(); }

    @PutMapping("/orders/{id}/assign/{partnerId}")
    public Order assignPartner(@PathVariable Integer id, @PathVariable Integer partnerId) {
        return orderService.assignDeliveryPartner(id, partnerId);
    }

    @GetMapping("/partners")
    public List<DeliveryPartner> getAllPartners() { return deliveryService.getAllPartners(); }

    @PostMapping("/partners")
    public DeliveryPartner createPartner(@RequestBody DeliveryPartner partner) {
        return deliveryService.savePartner(partner);
    }
}
