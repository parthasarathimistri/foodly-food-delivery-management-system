package com.foodly.service;
import com.foodly.model.Restaurant;
import com.foodly.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class RestaurantService {
    @Autowired private RestaurantRepository repository;
    public List<Restaurant> getAllRestaurants() { return repository.findAll(); }
    public Restaurant saveRestaurant(Restaurant r) { return repository.save(r); }
    public Restaurant getRestaurantById(Integer id) { return repository.findById(id).orElse(null); }
    public Restaurant getRestaurantByUserId(Integer userId) { return repository.findByUserId(userId).orElse(null); }
    public void deleteRestaurant(Integer id) { repository.deleteById(id); }
}
