package com.foodly.model;
import jakarta.persistence.*;
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") private Integer id;
    @ManyToOne @JoinColumn(name = "order_id", nullable = false) private Order order;
    @ManyToOne @JoinColumn(name = "item_id", nullable = false) private FoodItem foodItem;
    @Column(name = "quantity", nullable = false) private Integer quantity;
    public OrderItem() {}
    public OrderItem(Order order, FoodItem foodItem, Integer quantity) {
        this.order = order; this.foodItem = foodItem; this.quantity = quantity;
    }
    public Integer getId() { return id; } public void setId(Integer id) { this.id = id; }
    public Order getOrder() { return order; } public void setOrder(Order order) { this.order = order; }
    public FoodItem getFoodItem() { return foodItem; } public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }
    public Integer getQuantity() { return quantity; } public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
