package com.foodly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FoodDeliveryApplication
 * ---------------------------------
 * Entry point for the Food Delivery Platform.
 */
@SpringBootApplication
public class FoodDeliveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodDeliveryApplication.class, args);
        System.out.println("🚀 Food Delivery Platform Backend Started!");
        System.out.println("📡 API running at: http://localhost:8080/api");
    }
}
