package com.foodly.service;
import com.foodly.model.Coupon;
import com.foodly.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class CouponService {
    @Autowired private CouponRepository repository;
    public List<Coupon> getAllCoupons() { return repository.findAll(); }
    public Coupon createCoupon(Coupon coupon) { return repository.save(coupon); }
    public Optional<Coupon> validateCoupon(String code) { return repository.findByCodeAndActiveTrue(code); }
    public void deactivateCoupon(Integer id) {
        repository.findById(id).ifPresent(c -> { c.setActive(false); repository.save(c); });
    }
}
