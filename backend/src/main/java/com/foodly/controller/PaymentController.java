package com.foodly.controller;
import com.foodly.model.Payment;
import com.foodly.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired private PaymentService service;
    @GetMapping public List<Payment> getAll() { return service.getAllPayments(); }
    @PostMapping("/process") public Payment processPayment(@RequestParam Integer orderId, @RequestParam Double amount) {
        return service.processPayment(orderId, amount);
    }
}
