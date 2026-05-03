package com.foodly.controller;

import com.foodly.model.DeliveryPartner;
import com.foodly.model.Order;
import com.foodly.service.DeliveryPartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryPartnerController {

    @Autowired private DeliveryPartnerService service;

    @GetMapping("/partners")
    public List<DeliveryPartner> getAll() { return service.getAllPartners(); }

    @GetMapping("/partners/available")
    public List<DeliveryPartner> getAvailable() { return service.getAvailablePartners(); }

    @GetMapping("/partners/{id}")
    public DeliveryPartner getById(@PathVariable Integer id) {
        return service.getPartnerById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @GetMapping("/partners/user/{userId}")
    public DeliveryPartner getByUserId(@PathVariable Integer userId) {
        return service.getPartnerByUserId(userId).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @PostMapping("/partners")
    public DeliveryPartner create(@RequestBody DeliveryPartner partner) {
        return service.savePartner(partner);
    }

    @PutMapping("/partners/{id}/location")
    public DeliveryPartner updateLocation(@PathVariable Integer id, @RequestBody Map<String, Double> body) {
        return service.updateLocation(id, body.get("latitude"), body.get("longitude"));
    }

    @GetMapping("/orders/{partnerId}")
    public List<Order> getAssignedOrders(@PathVariable Integer partnerId) {
        return service.getAssignedOrders(partnerId);
    }

    @GetMapping("/orders/available")
    public List<Order> getAvailableOrders() { return service.getAvailableOrders(); }

    @PutMapping("/orders/{orderId}/accept/{partnerId}")
    public Order acceptOrder(@PathVariable Integer orderId, @PathVariable Integer partnerId) {
        return service.acceptOrder(orderId, partnerId);
    }

    @PutMapping("/orders/{orderId}/pickup")
    public Order pickup(@PathVariable Integer orderId) { return service.pickupOrder(orderId); }

    @PutMapping("/orders/{orderId}/deliver")
    public Order deliver(@PathVariable Integer orderId) { return service.deliverOrder(orderId); }
}
