package com.foodly.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id") private Integer paymentId;
    @ManyToOne @JoinColumn(name = "order_id", nullable = false) private Order order;
    @Column(name = "amount", nullable = false) private Double amount;
    @Column(name = "payment_status") private String paymentStatus;
    @Column(name = "payment_date") private LocalDateTime paymentDate = LocalDateTime.now();
    public Payment() {}
    public Payment(Order order, Double amount, String paymentStatus) {
        this.order = order; this.amount = amount; this.paymentStatus = paymentStatus;
    }
    public Integer getPaymentId() { return paymentId; } public void setPaymentId(Integer paymentId) { this.paymentId = paymentId; }
    public Order getOrder() { return order; } public void setOrder(Order order) { this.order = order; }
    public Double getAmount() { return amount; } public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentStatus() { return paymentStatus; } public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getPaymentDate() { return paymentDate; } public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
}
