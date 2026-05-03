package com.foodly;

import com.foodly.model.User;
import com.foodly.model.Role;
import com.foodly.model.Restaurant;
import com.foodly.model.FoodItem;
import com.foodly.model.Customer;
import com.foodly.model.DeliveryPartner;
import com.foodly.repository.UserRepository;
import com.foodly.repository.RestaurantRepository;
import com.foodly.repository.CustomerRepository;
import com.foodly.repository.FoodItemRepository;
import com.foodly.repository.DeliveryPartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * DataInitializer to create default users and sample data on startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private DeliveryPartnerRepository deliveryPartnerRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create ADMIN
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), Role.ADMIN, "System", "Admin", "admin@foodly.com", "9999999999");
            userRepository.save(admin);
            System.out.println("Admin created: admin/admin123");
        }

        // 2. Create Restaurants with Unique Logins
        if (restaurantRepository.count() == 0) {
            // Restaurant 1: Pizza Palace
            User restUser1 = createOrGetUser("pizza_palace", "rest123", Role.RESTAURANT, "Pizza", "Palace");
            Restaurant r1 = new Restaurant("Pizza Palace", "123 Main St", "Italian", 4.8);
            r1.setUserId(restUser1.getUserId());
            restaurantRepository.save(r1);

            // Restaurant 2: Burger King
            User restUser2 = createOrGetUser("burger_king", "rest123", Role.RESTAURANT, "Burger", "King");
            Restaurant r2 = new Restaurant("Burger King", "456 Oak Ave", "Fast Food", 4.2);
            r2.setUserId(restUser2.getUserId());
            restaurantRepository.save(r2);

            // Restaurant 3: Sushi Zen
            User restUser3 = createOrGetUser("sushi_zen", "rest123", Role.RESTAURANT, "Sushi", "Zen");
            Restaurant r3 = new Restaurant("Sushi Zen", "789 Pine Rd", "Japanese", 4.9);
            r3.setUserId(restUser3.getUserId());
            restaurantRepository.save(r3);

            // Add food items
            foodItemRepository.save(new FoodItem(r1, "Margherita Pizza", 12.99));
            foodItemRepository.save(new FoodItem(r1, "Pepperoni Pizza", 14.99));
            foodItemRepository.save(new FoodItem(r2, "Cheeseburger", 8.99));
            foodItemRepository.save(new FoodItem(r2, "Fries", 3.99));
            foodItemRepository.save(new FoodItem(r3, "California Roll", 11.50));
            foodItemRepository.save(new FoodItem(r3, "Miso Soup", 4.50));
            
            System.out.println("Sample restaurants and unique logins created.");
        }

        // 3. Create Customers with Unique Logins
        if (customerRepository.count() == 0) {
            User custUser1 = createOrGetUser("jane_smith", "user123", Role.CUSTOMER, "Jane", "Smith");
            Customer c1 = new Customer("Jane Smith", "jane@foodly.com", "6666666666", "101 Maple St");
            c1.setUserId(custUser1.getUserId());
            customerRepository.save(c1);
            System.out.println("Sample customer created.");
        }

        // 4. Create Delivery Partners with Unique Logins
        if (deliveryPartnerRepository.count() == 0) {
            User delUser1 = createOrGetUser("john_doe", "del123", Role.DELIVERY, "John", "Doe");
            DeliveryPartner p1 = new DeliveryPartner("John Doe", "7777777777");
            p1.setUserId(delUser1.getUserId());
            p1.setLatitude(12.9716);
            p1.setLongitude(77.5946);
            deliveryPartnerRepository.save(p1);
            System.out.println("Sample delivery partner created.");
        }
    }

    private User createOrGetUser(String username, String password, Role role, String first, String last) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User user = new User(username, passwordEncoder.encode(password), role, first, last, username + "@foodly.com", "0000000000");
            return userRepository.save(user);
        });
    }
}
