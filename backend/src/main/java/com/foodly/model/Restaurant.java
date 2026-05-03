package com.foodly.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id") 
    private Integer restaurantId;

    @Column(name = "name", nullable = false) 
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "cuisine") 
    private String cuisine;

    @Column(name = "rating") 
    private Double rating;

    @Column(name = "user_id")
    private Integer userId;

    public Restaurant() {}

    public Restaurant(String name, String address, String cuisine, Double rating) {
        this.name = name;
        this.address = address;
        this.cuisine = cuisine;
        this.rating = rating;
    }

    public Integer getRestaurantId() { return restaurantId; } 
    public void setRestaurantId(Integer restaurantId) { this.restaurantId = restaurantId; }
    
    public String getName() { return name; } 
    public void setName(String name) { this.name = name; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCuisine() { return cuisine; } 
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    
    public Double getRating() { return rating; } 
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
