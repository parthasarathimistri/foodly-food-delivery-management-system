package com.foodly.model;
import jakarta.persistence.*;
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id") private Integer couponId;
    @Column(name = "code", nullable = false, unique = true) private String code;
    @Column(name = "discount_percent", nullable = false) private Double discountPercent;
    @Column(name = "active", nullable = false) private Boolean active = true;
    public Coupon() {}
    public Coupon(String code, Double discountPercent) { this.code = code; this.discountPercent = discountPercent; }
    public Integer getCouponId() { return couponId; } public void setCouponId(Integer couponId) { this.couponId = couponId; }
    public String getCode() { return code; } public void setCode(String code) { this.code = code; }
    public Double getDiscountPercent() { return discountPercent; } public void setDiscountPercent(Double d) { this.discountPercent = d; }
    public Boolean getActive() { return active; } public void setActive(Boolean active) { this.active = active; }
}
