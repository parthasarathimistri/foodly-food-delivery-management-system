package com.foodly.service;

import com.foodly.model.DeliveryPartner;
import com.foodly.model.Order;
import com.foodly.repository.DeliveryPartnerRepository;
import com.foodly.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryPartnerService {

    @Autowired private DeliveryPartnerRepository partnerRepository;
    @Autowired private OrderRepository orderRepository;

    public List<DeliveryPartner> getAllPartners() {
        return partnerRepository.findAll();
    }

    public List<DeliveryPartner> getAvailablePartners() {
        return partnerRepository.findByAvailableTrue();
    }

    public Optional<DeliveryPartner> getPartnerById(Integer id) {
        return partnerRepository.findById(id);
    }

    public Optional<DeliveryPartner> getPartnerByUserId(Integer userId) {
        return partnerRepository.findByUserId(userId);
    }

    public DeliveryPartner savePartner(DeliveryPartner partner) {
        return partnerRepository.save(partner);
    }

    public DeliveryPartner updateLocation(Integer partnerId, Double lat, Double lng) {
        DeliveryPartner p = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new RuntimeException("Partner not found"));
        p.setLatitude(lat);
        p.setLongitude(lng);
        return partnerRepository.save(p);
    }

    public List<Order> getAssignedOrders(Integer partnerId) {
        return orderRepository.findByDeliveryPartnerPartnerId(partnerId);
    }

    public List<Order> getAvailableOrders() {
        return orderRepository.findByDeliveryPartnerIsNullAndStatusIn(
            Arrays.asList("ACCEPTED", "PLACED")
        );
    }

    public Order pickupOrder(Integer orderId) {
        Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        o.setStatus("PICKED_UP");
        return orderRepository.save(o);
    }

    public Order deliverOrder(Integer orderId) {
        Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        o.setStatus("DELIVERED");
        // Add earnings for partner
        if (o.getDeliveryPartner() != null) {
            DeliveryPartner p = o.getDeliveryPartner();
            p.setTotalEarnings(p.getTotalEarnings() + (o.getDeliveryFee() != null ? o.getDeliveryFee() : 2.99));
            p.setAvailable(true);
            partnerRepository.save(p);
        }
        return orderRepository.save(o);
    }

    public Order acceptOrder(Integer orderId, Integer partnerId) {
        Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        DeliveryPartner p = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new RuntimeException("Partner not found"));
        o.setDeliveryPartner(p);
        o.setStatus("ASSIGNED");
        p.setAvailable(false);
        partnerRepository.save(p);
        return orderRepository.save(o);
    }
}
