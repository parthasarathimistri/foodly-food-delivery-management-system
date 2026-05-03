package com.foodly.controller;
import com.foodly.model.FoodItem;
import com.foodly.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/restaurants/{restaurantId}/items")
public class FoodItemController {
    @Autowired private FoodItemService service;
    @GetMapping public List<FoodItem> getItems(@PathVariable Integer restaurantId) { return service.getItemsByRestaurant(restaurantId); }
    @PostMapping public FoodItem addItem(@PathVariable Integer restaurantId, @RequestBody FoodItem item) { return service.saveFoodItem(restaurantId, item); }
}
