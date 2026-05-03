package com.foodly.repository;

import com.foodly.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerCustomerId(Integer customerId);
    List<Order> findByRestaurantRestaurantId(Integer restaurantId);
    List<Order> findByDeliveryPartnerPartnerId(Integer partnerId);
    List<Order> findByDeliveryPartnerIsNullAndStatusIn(List<String> statuses);
    List<Order> findByStatus(String status);
}
