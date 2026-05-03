package com.foodly.controller;
import com.foodly.model.Coupon;
import com.foodly.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    @Autowired private CouponService service;
    @GetMapping public List<Coupon> getAll() { return service.getAllCoupons(); }
    @PostMapping public Coupon create(@RequestBody Coupon coupon) { return service.createCoupon(coupon); }
    @GetMapping("/validate/{code}") public ResponseEntity<?> validate(@PathVariable String code) {
        return service.validateCoupon(code)
            .map(c -> ResponseEntity.ok(Map.of("valid", true, "discountPercent", c.getDiscountPercent(), "code", c.getCode())))
            .orElse(ResponseEntity.ok(Map.of("valid", false)));
    }
    @PutMapping("/{id}/deactivate") public void deactivate(@PathVariable Integer id) { service.deactivateCoupon(id); }
}
