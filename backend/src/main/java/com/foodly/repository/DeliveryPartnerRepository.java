package com.foodly.repository;

import com.foodly.model.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Integer> {
    List<DeliveryPartner> findByAvailableTrue();
    Optional<DeliveryPartner> findByUserId(Integer userId);
}
