package com.foodly.service;
import com.foodly.model.Customer;
import com.foodly.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CustomerService {
    @Autowired private CustomerRepository repository;
    public List<Customer> getAllCustomers() { return repository.findAll(); }
    public Customer saveCustomer(Customer customer) { return repository.save(customer); }
    public Customer getCustomerById(Integer id) { return repository.findById(id).orElse(null); }
    public Customer getCustomerByUserId(Integer userId) { return repository.findByUserId(userId).orElse(null); }
    public void deleteCustomer(Integer id) { repository.deleteById(id); }
}
