package com.foodly.service;

import com.foodly.model.Order;
import com.foodly.model.Customer;
import com.foodly.model.Restaurant;
import com.foodly.model.DeliveryPartner;
import com.foodly.repository.OrderRepository;
import com.foodly.repository.CustomerRepository;
import com.foodly.repository.RestaurantRepository;
import com.foodly.repository.DeliveryPartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private DeliveryPartnerRepository deliveryPartnerRepository;

    public List<Order> getAllOrders() { return orderRepository.findAll(); }

    public List<Order> getOrdersByCustomer(Integer customerId) {
        return orderRepository.findByCustomerCustomerId(customerId);
    }

    public List<Order> getOrdersByRestaurant(Integer restaurantId) {
        return orderRepository.findByRestaurantRestaurantId(restaurantId);
    }

    public Order placeOrder(Integer customerId, Integer restaurantId, Order order) {
        Customer c = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        Restaurant r = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        order.setCustomer(c);
        order.setRestaurant(r);
        order.setStatus("PLACED");
        return orderRepository.save(order);
    }

    public Order updateStatus(Integer orderId, String status) {
        Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        o.setStatus(status);
        return orderRepository.save(o);
    }

    public Order acceptOrder(Integer orderId) {
        return updateStatus(orderId, "ACCEPTED");
    }

    public Order rejectOrder(Integer orderId) {
        return updateStatus(orderId, "CANCELLED");
    }

    public Order assignDeliveryPartner(Integer orderId, Integer partnerId) {
        Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        DeliveryPartner p = deliveryPartnerRepository.findById(partnerId)
            .orElseThrow(() -> new RuntimeException("Partner not found"));
        o.setDeliveryPartner(p);
        o.setStatus("ASSIGNED");
        return orderRepository.save(o);
    }

    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
