package com.foodly.model;
import jakarta.persistence.*;
@Entity
@Table(name = "food_items")
public class FoodItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id") private Integer itemId;
    @ManyToOne @JoinColumn(name = "restaurant_id", nullable = false) private Restaurant restaurant;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "price", nullable = false) private Double price;
    public FoodItem() {}
    public FoodItem(Restaurant restaurant, String name, Double price) {
        this.restaurant = restaurant; this.name = name; this.price = price;
    }
    public Integer getItemId() { return itemId; } public void setItemId(Integer itemId) { this.itemId = itemId; }
    public Restaurant getRestaurant() { return restaurant; } public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; } public void setPrice(Double price) { this.price = price; }
}
