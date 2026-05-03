package com.foodly.service;
import com.foodly.model.Payment;
import com.foodly.model.Order;
import com.foodly.repository.PaymentRepository;
import com.foodly.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class PaymentService {
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderRepository orderRepository;
    public List<Payment> getAllPayments() { return paymentRepository.findAll(); }
    public Payment processPayment(Integer orderId, Double amount) {
        Order o = orderRepository.findById(orderId).orElseThrow();
        Payment p = new Payment(o, amount, "COMPLETED");
        o.setStatus("PAID");
        orderRepository.save(o);
        return paymentRepository.save(p);
    }
}
