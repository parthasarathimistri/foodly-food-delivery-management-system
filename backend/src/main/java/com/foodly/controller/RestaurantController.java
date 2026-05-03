package com.foodly.controller;
import com.foodly.model.Restaurant;
import com.foodly.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    @Autowired private RestaurantService service;
    @GetMapping public List<Restaurant> getAll() { return service.getAllRestaurants(); }
    @GetMapping("/user/{userId}") public Restaurant getByUserId(@PathVariable Integer userId) { return service.getRestaurantByUserId(userId); }
    @PostMapping public Restaurant create(@RequestBody Restaurant restaurant) { return service.saveRestaurant(restaurant); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Integer id) { service.deleteRestaurant(id); }
}
