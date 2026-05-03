package com.foodly.service;
import com.foodly.model.FoodItem;
import com.foodly.model.Restaurant;
import com.foodly.repository.FoodItemRepository;
import com.foodly.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class FoodItemService {
    @Autowired private FoodItemRepository repository;
    @Autowired private RestaurantRepository restaurantRepository;
    public List<FoodItem> getAllFoodItems() { return repository.findAll(); }
    public List<FoodItem> getItemsByRestaurant(Integer restaurantId) { return repository.findByRestaurantRestaurantId(restaurantId); }
    public FoodItem saveFoodItem(Integer restaurantId, FoodItem item) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow(()->new RuntimeException("Restaurant not found"));
        item.setRestaurant(r);
        return repository.save(item);
    }
}
