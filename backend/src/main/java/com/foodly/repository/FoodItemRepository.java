package com.foodly.repository;
import com.foodly.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> { 
    List<FoodItem> findByRestaurantRestaurantId(Integer restaurantId);
}
