package com.foodly.controller;
import com.foodly.model.Customer;
import com.foodly.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired private CustomerService service;
    @GetMapping public List<Customer> getAll() { return service.getAllCustomers(); }
    @GetMapping("/{id}") public Customer getById(@PathVariable Integer id) { return service.getCustomerById(id); }
    @GetMapping("/user/{userId}") public Customer getByUserId(@PathVariable Integer userId) { return service.getCustomerByUserId(userId); }
    @PostMapping public Customer create(@RequestBody Customer customer) { return service.saveCustomer(customer); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Integer id) { service.deleteCustomer(id); }
}
